
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			div0.textContent = "Chernobyl";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = `${new Date()}`;
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Func";
    			add_location(div0, file, 14, 6, 247);
    			add_location(div1, file, 15, 6, 274);
    			add_location(div2, file, 16, 6, 304);
    			attr_dev(nav, "class", "nav svelte-i4nz5l");
    			add_location(nav, file, 13, 0, 223);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			append_dev(nav, t1);
    			append_dev(nav, div1);
    			append_dev(nav, t3);
    			append_dev(nav, div2);
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

    var nf = {
    	name: "Netflix",
    	icon: "./assets/ic/Netflix.svg",
    	prelink: "https://www.netflix.com/search?q=",
    	postlink: ""
    };
    var git = {
    	name: "Github",
    	icon: "./assets/ic/GitHub.svg",
    	prelink: "https://github.com/search?&q=",
    	postlink: "",
    	me: "https://github.com/plutoniumblast?tab=repositories",
    	"new": "https://github.com/new",
    	settings: "https://github.com/settings/profile",
    	notifs: "https://github.com/notifications?query=is%3Aunread"
    };
    var g = {
    	name: "Google",
    	icon: "./assets/ic/Google.svg",
    	mail: "https://mail.google.com/",
    	prelink: "https://www.google.com/search?q=",
    	postlink: ""
    };
    var gi = {
    	name: "GImages",
    	icon: "./assets/ic/GImages.svg",
    	prelink: "https://www.google.com/search?q=",
    	postlink: "&tbs=imgo:1,&tbm=isch"
    };
    var ddg = {
    	name: "DuckDuckGo",
    	icon: "./assets/ic/DuckDuckGo.svg",
    	prelink: "https://duckduckgo.com/?q=",
    	postlink: ""
    };
    var r = {
    	name: "Reddit",
    	icon: "./assets/ic/Reddit.svg",
    	prelink: "https://www.reddit.com/search?q=",
    	postlink: ""
    };
    var y = {
    	name: "Youtube",
    	icon: "./assets/ic/Youtube.svg",
    	prelink: "https://www.youtube.com/results?search_query=",
    	postlink: "",
    	"new": "https://www.youtube.com/feed/subscriptions"
    };
    var ig = {
    	name: "Instagram",
    	icon: "./assets/ic/Instagram.svg",
    	prelink: "https://www.google.com/search?q=",
    	postlink: " instagram",
    	me: "https://www.instagram.com/plutonium.rar/",
    	dm: "https://www.instagram.com/direct/inbox/"
    };
    var ap = {
    	name: "Amazon Prime",
    	icon: "./assets/ic/Amazon.svg",
    	prelink: "https://www.primevideo.com/search/ref=atv_nb_sr?phrase=",
    	postlink: "&ie=UTF8"
    };
    var imdb = {
    	name: "IMDB",
    	icon: "./assets/ic/IMDb.svg",
    	prelink: "https://www.imdb.com/find?q=",
    	postlink: "&ref_=nv_sr_sm"
    };
    var dict = {
    	name: "Merriam Webster",
    	icon: "./assets/ic/Webster.svg",
    	prelink: "https://www.merriam-webster.com/dictionary/",
    	postlink: ""
    };
    var wiki = {
    	name: "Wikipedia",
    	icon: "./assets/ic/Wikipedia.svg",
    	prelink: "https://en.wikipedia.org/wiki/Special:Search?search=",
    	postlink: ""
    };
    var ht = {
    	name: "Links",
    	icon: "./assets/ic/Web.svg",
    	prelink: "https://",
    	postlink: ""
    };
    var sites = {
    	nf: nf,
    	git: git,
    	g: g,
    	gi: gi,
    	ddg: ddg,
    	r: r,
    	y: y,
    	ig: ig,
    	ap: ap,
    	imdb: imdb,
    	dict: dict,
    	wiki: wiki,
    	">": {
    	name: "Functions",
    	icon: "./assets/ic/Terminal.svg",
    	now: "time.is",
    	mail: "https://www.icloud.com/mail/"
    },
    	ht: ht
    };

    const checkKey = ( key ) => {
          if ( typeof sites[ key ] == "undefined" ) return false;
          else return true;
    };
    const startsWith = ( str, word ) => {
          return str.lastIndexOf( word, 0 ) === 0;
    };

    const preprocessor = ( key ) => {
          const sitFuncs = { "y": "window.location.href = send;" };
          const script = sitFuncs[ key ] || "window.location.href = send;";
          return script
    };

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
    	let img;
    	let img_src_value;
    	let t2;
    	let input0;
    	let input0_size_value;
    	let t3;
    	let div1;
    	let t5;
    	let input1;
    	let t6;
    	let div3;
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
    			img = element("img");
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "follower";
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			div3 = element("div");
    			if (img.src !== (img_src_value = "./icons/Basic.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1baylcw");
    			add_location(img, file$2, 123, 24, 4273);
    			attr_dev(div0, "class", "icon");
    			add_location(div0, file$2, 122, 18, 4230);
    			attr_dev(input0, "id", "magic");
    			attr_dev(input0, "size", input0_size_value = /*raw*/ ctx[0].length > 40 ? 40 : /*raw*/ ctx[0].length);
    			attr_dev(input0, "class", "svelte-1baylcw");
    			add_location(input0, file$2, 125, 18, 4370);
    			add_location(div1, file$2, 131, 18, 4619);
    			attr_dev(div2, "class", "wrapper svelte-1baylcw");
    			set_style(div2, "display", "flex");
    			add_location(div2, file$2, 121, 12, 4169);
    			attr_dev(input1, "type", "submit");
    			set_style(input1, "display", "none");
    			add_location(input1, file$2, 133, 12, 4670);
    			attr_dev(form, "class", "svelte-1baylcw");
    			add_location(form, file$2, 120, 6, 4117);
    			attr_dev(div3, "id", "staticBox");
    			add_location(div3, file$2, 135, 6, 4735);
    			set_style(section, "display", "flex");
    			set_style(section, "justify-content", "center");
    			set_style(section, "align-items", "center");
    			set_style(section, "flex-direction", "column");
    			add_location(section, file$2, 117, 0, 3946);
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
    			append_dev(div0, img);
    			/*img_binding*/ ctx[7](img);
    			append_dev(div2, t2);
    			append_dev(div2, input0);
    			/*input0_binding*/ ctx[8](input0);
    			set_input_value(input0, /*raw*/ ctx[0]);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(form, t5);
    			append_dev(form, input1);
    			append_dev(section, t6);
    			append_dev(section, div3);
    			/*div3_binding*/ ctx[10](div3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "keyup", /*go*/ ctx[4], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(form, "submit", prevent_default(/*metal*/ ctx[5]), false, true, false)
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
    			/*img_binding*/ ctx[7](null);
    			/*input0_binding*/ ctx[8](null);
    			/*div3_binding*/ ctx[10](null);
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
    	let raw = "", magic, ic, staticBox;

    	const fx = p => {
    		const val = +p.split(" ")[0];
    		const frm = p.split(" ")[1];
    		const fin = p.split(" ")[2];

    		fetch(`https://api.exchangerate-api.com/v4/latest/${frm}`).then(res => res.json()).then(res => {
    			const rate = res.rates[fin];
    			const ans = `${val} ${frm} = ${+rate * val} ${fin}`;
    			console.log(ans);
    			$$invalidate(3, staticBox.innerHTML += "<br>" + ans, staticBox);
    		});
    	};

    	const go = () => {
    		let term;

    		if (checkKey(key)) {
    			if (startsWith(raw, key + " ")) {
    				term = raw.replace(key + " ", "");

    				// if (term != "") sug(term);
    				send = sites[key].prelink + term + sites[key].postlink;
    			}

    			if (startsWith(raw, key + ":")) {
    				term = raw.replace(key + ":", "");
    				send = sites[key][term];
    			}

    			$$invalidate(2, ic.src = `./icons/${sites[key].name}.svg`, ic);
    		}

    		if (raw != "" && !checkKey(key)) {
    			key = "g";
    			term = raw;

    			// if (term != "") sug(term);
    			send = sites[key].prelink + term + sites[key].postlink;

    			$$invalidate(2, ic.src = `./icons/${sites[key].name}.svg`, ic);
    		}
    	};

    	const metal = () => {
    		if (magic.value == "") {
    			alert("Please Enter A search Term");
    		} else {
    			if (startsWith(raw, "> ")) {
    				let exec = raw.replace("> ", "");
    				let fn = exec.split(" ")[0];
    				let param = exec.replace(fn + " ", "");

    				switch (fn) {
    					case "fx":
    						fx(param);
    						break;
    					default:
    						alert("invalid func");
    						break;
    				}
    			} else // if (fn == "cal" ||fn == "calc" ||fn == "eval" ||fn == "solve") {calc(param);}
    			{
    				if (startsWith(raw, "https://") || startsWith(raw, "http://")) {
    					window.location.href = raw.replace("http://", "https://"); // if (fn == "t") {count(+param);}
    				} else {
    					const scr = preprocessor(key);
    					eval(scr);
    				}
    			}
    		}
    	};

    	onMount(() => {
    		magic.focus();
    	});

    	const writable_props = ["sites"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ic = $$value;
    			$$invalidate(2, ic);
    		});
    	}

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

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			staticBox = $$value;
    			$$invalidate(3, staticBox);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("sites" in $$props) $$invalidate(6, sites = $$props.sites);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		checkKey,
    		startsWith,
    		preprocessor,
    		sites,
    		raw,
    		magic,
    		ic,
    		staticBox,
    		fx,
    		go,
    		metal,
    		key,
    		send
    	});

    	$$self.$inject_state = $$props => {
    		if ("sites" in $$props) $$invalidate(6, sites = $$props.sites);
    		if ("raw" in $$props) $$invalidate(0, raw = $$props.raw);
    		if ("magic" in $$props) $$invalidate(1, magic = $$props.magic);
    		if ("ic" in $$props) $$invalidate(2, ic = $$props.ic);
    		if ("staticBox" in $$props) $$invalidate(3, staticBox = $$props.staticBox);
    		if ("key" in $$props) key = $$props.key;
    		if ("send" in $$props) send = $$props.send;
    	};

    	let key;
    	let send;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*raw*/ 1) {
    			 key = raw.split(":")[0].split(" ")[0].toLowerCase();
    		}
    	};

    	 send = "";

    	return [
    		raw,
    		magic,
    		ic,
    		staticBox,
    		go,
    		metal,
    		sites,
    		img_binding,
    		input0_binding,
    		input0_input_handler,
    		div3_binding
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { sites: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sites*/ ctx[6] === undefined && !("sites" in props)) {
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

    /* src/micro/quick.svelte generated by Svelte v3.29.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/micro/quick.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let a;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let t1_value = /*link*/ ctx[0].name + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			t1 = text(t1_value);
    			if (img.src !== (img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "onerror", "this.onerror=null;this.src='https://static.toiimg.com/photo/72975551.cms';");
    			attr_dev(img, "alt", img_alt_value = /*link*/ ctx[0].name);
    			attr_dev(img, "class", "svelte-nnm6qi");
    			add_location(img, file$3, 38, 18, 980);
    			add_location(div0, file$3, 37, 12, 956);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[0].link);
    			attr_dev(a, "class", "svelte-nnm6qi");
    			add_location(a, file$3, 36, 6, 923);
    			attr_dev(div1, "class", "quick svelte-nnm6qi");
    			add_location(div1, file$3, 35, 0, 897);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, div0);
    			append_dev(div0, img);
    			/*img_binding*/ ctx[2](img);
    			append_dev(a, t0);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*link*/ 1 && img_alt_value !== (img_alt_value = /*link*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*link*/ 1 && t1_value !== (t1_value = /*link*/ ctx[0].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*link*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[0].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*img_binding*/ ctx[2](null);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Quick", slots, []);
    	let { link } = $$props;
    	let linkImg;
    	var favi = link.link.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0];

    	fetch("http://favicongrabber.com/api/grab/" + favi).then(r => r.json()).then(fi => {
    		if (fi) {
    			$$invalidate(1, linkImg.src = fi.icons[fi.icons.length - 1].src, linkImg);
    		} else {
    			$$invalidate(1, linkImg.src = "https://static.toiimg.com/photo/72975551.cms", linkImg);
    		}
    	}).catch(e => console.log(e));

    	const writable_props = ["link"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Quick> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			linkImg = $$value;
    			$$invalidate(1, linkImg);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({ link, linkImg, favi });

    	$$self.$inject_state = $$props => {
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    		if ("linkImg" in $$props) $$invalidate(1, linkImg = $$props.linkImg);
    		if ("favi" in $$props) favi = $$props.favi;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link, linkImg, img_binding];
    }

    class Quick extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quick",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !("link" in props)) {
    			console_1$1.warn("<Quick> was created without expected prop 'link'");
    		}
    	}

    	get link() {
    		throw new Error("<Quick>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Quick>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/links.svelte generated by Svelte v3.29.0 */

    const { console: console_1$2 } = globals;
    const file$4 = "src/components/links.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (26:12) {#each data as link}
    function create_each_block(ctx) {
    	let quick;
    	let current;

    	quick = new Quick({
    			props: { link: /*link*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(quick.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(quick, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const quick_changes = {};
    			if (dirty & /*data*/ 1) quick_changes.link = /*link*/ ctx[1];
    			quick.$set(quick_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quick.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quick.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quick, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(26:12) {#each data as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let div;
    	let current;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "quickCont svelte-aa6sae");
    			set_style(div, "width", "80%");
    			add_location(div, file$4, 24, 6, 423);
    			attr_dev(section, "class", "links svelte-aa6sae");
    			set_style(section, "width", "100%");
    			add_location(section, file$4, 23, 0, 374);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots("Links", slots, []);
    	let { data } = $$props;
    	console.log(data);
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Links> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data, Quick });

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Links extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Links",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console_1$2.warn("<Links> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Links>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Links>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.29.0 */

    const { console: console_1$3 } = globals;
    const file$5 = "src/App.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(main, file$5, 17, 0, 326);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { sites } = $$props, { days } = $$props, { links } = $$props;
    	console.log(days);
    	const writable_props = ["sites", "days", "links"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<App> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { sites: 0, days: 2, links: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sites*/ ctx[0] === undefined && !("sites" in props)) {
    			console_1$3.warn("<App> was created without expected prop 'sites'");
    		}

    		if (/*days*/ ctx[2] === undefined && !("days" in props)) {
    			console_1$3.warn("<App> was created without expected prop 'days'");
    		}

    		if (/*links*/ ctx[1] === undefined && !("links" in props)) {
    			console_1$3.warn("<App> was created without expected prop 'links'");
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
