
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/navbar.svelte generated by Svelte v3.29.0 */

    const file = "src/components/navbar.svelte";

    function create_fragment(ctx) {
    	let nav;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			nav.textContent = "Nav";
    			attr_dev(nav, "class", "nav svelte-1q22xc8");
    			add_location(nav, file, 12, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/sidebar.svelte generated by Svelte v3.29.0 */

    const file$1 = "src/components/sidebar.svelte";

    function create_fragment$1(ctx) {
    	let section;

    	const block = {
    		c: function create() {
    			section = element("section");
    			section.textContent = "Hi";
    			add_location(section, file$1, 6, 0, 38);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/search.svelte generated by Svelte v3.29.0 */

    const { console: console_1 } = globals;
    const file$2 = "src/components/search.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let t0_value = new Date().toLocaleTimeString("en-GB").slice(0, -3) + "";
    	let t0;
    	let t1;
    	let form;
    	let div2;
    	let div0;
    	let t3;
    	let input0;
    	let input0_size_value;
    	let t4;
    	let div1;
    	let t6;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			t0 = text(t0_value);
    			t1 = space();
    			form = element("form");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "icon";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "follower";
    			t6 = space();
    			input1 = element("input");
    			attr_dev(div0, "class", "icon");
    			add_location(div0, file$2, 35, 18, 828);
    			attr_dev(input0, "id", "magic");
    			attr_dev(input0, "size", input0_size_value = /*raw*/ ctx[0].length > 40 ? 40 : /*raw*/ ctx[0].length);
    			attr_dev(input0, "class", "svelte-yz0cu2");
    			add_location(input0, file$2, 36, 18, 875);
    			add_location(div1, file$2, 41, 18, 1086);
    			attr_dev(div2, "class", "wrapper svelte-yz0cu2");
    			set_style(div2, "display", "flex");
    			add_location(div2, file$2, 34, 12, 767);
    			attr_dev(input1, "type", "submit");
    			set_style(input1, "display", "none");
    			add_location(input1, file$2, 43, 12, 1137);
    			attr_dev(form, "class", "svelte-yz0cu2");
    			add_location(form, file$2, 33, 6, 722);
    			set_style(section, "display", "flex");
    			set_style(section, "justify-content", "center");
    			set_style(section, "align-items", "center");
    			set_style(section, "flex-direction", "column");
    			add_location(section, file$2, 30, 0, 551);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, t0);
    			append_dev(section, t1);
    			append_dev(section, form);
    			append_dev(form, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t3);
    			append_dev(div2, input0);
    			/*input0_binding*/ ctx[4](input0);
    			set_input_value(input0, /*raw*/ ctx[0]);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(form, t6);
    			append_dev(form, input1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", /*submitHandler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1 && input0_size_value !== (input0_size_value = /*raw*/ ctx[0].length > 40 ? 40 : /*raw*/ ctx[0].length)) {
    				attr_dev(input0, "size", input0_size_value);
    			}

    			if (dirty & /*raw*/ 1 && input0.value !== /*raw*/ ctx[0]) {
    				set_input_value(input0, /*raw*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			/*input0_binding*/ ctx[4](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, []);
    	let { sites } = $$props;
    	console.log(sites);
    	let raw = "", magic;

    	const submitHandler = () => {
    		console.log(raw);
    	};

    	onMount(() => {
    		magic.focus();
    	});

    	const writable_props = ["sites"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			magic = $$value;
    			$$invalidate(1, magic);
    		});
    	}

    	function input0_input_handler() {
    		raw = this.value;
    		$$invalidate(0, raw);
    	}

    	$$self.$$set = $$props => {
    		if ("sites" in $$props) $$invalidate(3, sites = $$props.sites);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		sites,
    		raw,
    		magic,
    		submitHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ("sites" in $$props) $$invalidate(3, sites = $$props.sites);
    		if ("raw" in $$props) $$invalidate(0, raw = $$props.raw);
    		if ("magic" in $$props) $$invalidate(1, magic = $$props.magic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [raw, magic, submitHandler, sites, input0_binding, input0_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { sites: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sites*/ ctx[3] === undefined && !("sites" in props)) {
    			console_1.warn("<Search> was created without expected prop 'sites'");
    		}
    	}

    	get sites() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sites(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/links.svelte generated by Svelte v3.29.0 */

    const file$3 = "src/components/links.svelte";

    function create_fragment$3(ctx) {
    	let section;

    	const block = {
    		c: function create() {
    			section = element("section");
    			section.textContent = "Hi";
    			add_location(section, file$3, 6, 0, 38);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Links", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Links> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Links extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Links",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.29.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "src/App.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let sidebar;
    	let t1;
    	let search;
    	let t2;
    	let links_1;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	sidebar = new Sidebar({ $$inline: true });

    	search = new Search({
    			props: { sites: /*sites*/ ctx[0] },
    			$$inline: true
    		});

    	links_1 = new Links({
    			props: { data: /*links*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(sidebar.$$.fragment);
    			t1 = space();
    			create_component(search.$$.fragment);
    			t2 = space();
    			create_component(links_1.$$.fragment);
    			add_location(main, file$4, 18, 0, 347);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			mount_component(sidebar, main, null);
    			append_dev(main, t1);
    			mount_component(search, main, null);
    			append_dev(main, t2);
    			mount_component(links_1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const search_changes = {};
    			if (dirty & /*sites*/ 1) search_changes.sites = /*sites*/ ctx[0];
    			search.$set(search_changes);
    			const links_1_changes = {};
    			if (dirty & /*links*/ 2) links_1_changes.data = /*links*/ ctx[1];
    			links_1.$set(links_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(search.$$.fragment, local);
    			transition_in(links_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(search.$$.fragment, local);
    			transition_out(links_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(sidebar);
    			destroy_component(search);
    			destroy_component(links_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { sites } = $$props, { days } = $$props, { links } = $$props;
    	console.log(days);
    	console.log(links);
    	const writable_props = ["sites", "days", "links"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("sites" in $$props) $$invalidate(0, sites = $$props.sites);
    		if ("days" in $$props) $$invalidate(2, days = $$props.days);
    		if ("links" in $$props) $$invalidate(1, links = $$props.links);
    	};

    	$$self.$capture_state = () => ({
    		sites,
    		days,
    		links,
    		Navbar,
    		Sidebar,
    		Search,
    		Links
    	});

    	$$self.$inject_state = $$props => {
    		if ("sites" in $$props) $$invalidate(0, sites = $$props.sites);
    		if ("days" in $$props) $$invalidate(2, days = $$props.days);
    		if ("links" in $$props) $$invalidate(1, links = $$props.links);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sites, links, days];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { sites: 0, days: 2, links: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sites*/ ctx[0] === undefined && !("sites" in props)) {
    			console_1$1.warn("<App> was created without expected prop 'sites'");
    		}

    		if (/*days*/ ctx[2] === undefined && !("days" in props)) {
    			console_1$1.warn("<App> was created without expected prop 'days'");
    		}

    		if (/*links*/ ctx[1] === undefined && !("links" in props)) {
    			console_1$1.warn("<App> was created without expected prop 'links'");
    		}
    	}

    	get sites() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sites(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get days() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set days(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get links() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const sites = JSON.parse( '{"nf":{"name":"Netflix","icon":"./assets/ic/Netflix.svg","prelink":"https://www.netflix.com/search?q=","postlink":""},"git":{"name":"Github","icon":"./assets/ic/GitHub.svg","prelink":"https://github.com/search?&q=","postlink":"","me":"https://github.com/plutoniumblast?tab=repositories","new":"https://github.com/new","settings":"https://github.com/settings/profile","notifs":"https://github.com/notifications?query=is%3Aunread"},"g":{"name":"Google","icon":"./assets/ic/Google.svg","mail":"https://mail.google.com/","prelink":"https://www.google.com/search?q=","postlink":""},"gi":{"name":"Google Images","icon":"./assets/ic/GImages.svg","prelink":"https://www.google.com/search?q=","postlink":"&tbs=imgo:1,&tbm=isch"},"ddg":{"name":"DuckDuckGo","icon":"./assets/ic/DuckDuckGo.svg","prelink":"https://duckduckgo.com/?q=","postlink":""},"r":{"name":"Reddit","icon":"./assets/ic/Reddit.svg","prelink":"https://www.reddit.com/search?q=","postlink":""},"y":{"name":"Youtube","icon":"./assets/ic/Youtube.svg","prelink":"https://www.youtube.com/results?search_query=","postlink":"","new":"https://www.youtube.com/feed/subscriptions"},"ig":{"name":"Instagram","icon":"./assets/ic/Instagram.svg","prelink":"https://www.google.com/search?q=","postlink":" instagram","me":"https://www.instagram.com/plutonium.rar/","dm":"https://www.instagram.com/direct/inbox/"},"ap":{"name":"Amazon Prime","icon":"./assets/ic/Amazon.svg","prelink":"https://www.primevideo.com/search/ref=atv_nb_sr?phrase=","postlink":"&ie=UTF8"},"imdb":{"name":"IMDB","icon":"./assets/ic/IMDb.svg","prelink":"https://www.imdb.com/find?q=","postlink":"&ref_=nv_sr_sm"},"dict":{"name":"Merriam Webster","icon":"./assets/ic/Webster.svg","prelink":"https://www.merriam-webster.com/dictionary/","postlink":""},"wiki":{"name":"Wikipedia","icon":"./assets/ic/Wikipedia.svg","prelink":"https://en.wikipedia.org/wiki/Special:Search?search=","postlink":""},">":{"name":"Functions","icon":"./assets/ic/Terminal.svg","now":"time.is","mail":"https://www.icloud.com/mail/"},"ht":{"name":"Links","icon":"./assets/ic/Web.svg","prelink":"https://","postlink":""}}' );

    const links = [
    	{ 'name': 'DigialOcean', 'link': 'https://cloud.digitalocean.com/login', },
    	{ 'name': 'FontAwesome', 'link': 'https://fontawesome.com/icons?d=gallery&m=free', },
    	{ 'name': 'Firebase', 'link': 'http://console.firebase.google.com/', },
    	{ 'name': 'Figma', 'link': 'https://www.figma.com/files/recent', },
    	{ 'name': 'GoDaddy', 'link': 'https://sso.godaddy.com/?realm=idp&path=%2Fproducts&app=account', },
    	{ 'name': 'CodePen', 'link': 'https://codepen.io', }
    ];

    const days = [
    	{ 'name': 'D-Day', 'type': 'since', 'date': '08/06/2019', },
    	{ 'name': 'Lockdown', 'type': 'till', 'date': '03/17/2020', },
    ];

    const app = new App( {
    	target: document.body,
    	props: { sites: sites, links: links, days: days }
    } );

    return app;

}());
