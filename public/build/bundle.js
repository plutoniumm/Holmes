
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.28.0' }, detail)));
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

    /* src/components/navbar.svelte generated by Svelte v3.28.0 */

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
    			div1.textContent = `${new Date().toLocaleString("en-GB")}`;
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Newton";
    			add_location(div0, file, 14, 6, 247);
    			add_location(div1, file, 15, 6, 274);
    			attr_dev(div2, "onclick", "window.location.href='http://localhost:3000'");
    			add_location(div2, file, 16, 6, 328);
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

    /* src/components/days.svelte generated by Svelte v3.28.0 */

    const file$1 = "src/components/days.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (22:6) {#each days as day}
    function create_each_block(ctx) {
    	let div;
    	let span;
    	let t0_value = /*day*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = Math.round((new Date() - new Date(/*day*/ ctx[1].date)) / (1000 * 86400)) + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			set_style(span, "text-transform", "uppercase");
    			set_style(span, "font-size", "0.75em");
    			set_style(span, "color", "#999");
    			add_location(span, file$1, 23, 18, 447);
    			add_location(br, file$1, 27, 18, 618);
    			attr_dev(div, "class", "track svelte-19679i4");
    			add_location(div, file$1, 22, 12, 409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*days*/ 1 && t0_value !== (t0_value = /*day*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*days*/ 1 && t3_value !== (t3_value = Math.round((new Date() - new Date(/*day*/ ctx[1].date)) / (1000 * 86400)) + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(22:6) {#each days as day}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let each_value = /*days*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "class", "svelte-19679i4");
    			add_location(section, file$1, 20, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Math, Date, days*/ 1) {
    				each_value = /*days*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Days", slots, []);
    	let { days } = $$props;
    	const writable_props = ["days"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Days> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("days" in $$props) $$invalidate(0, days = $$props.days);
    	};

    	$$self.$capture_state = () => ({ days });

    	$$self.$inject_state = $$props => {
    		if ("days" in $$props) $$invalidate(0, days = $$props.days);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [days];
    }

    class Days extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { days: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Days",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*days*/ ctx[0] === undefined && !("days" in props)) {
    			console.warn("<Days> was created without expected prop 'days'");
    		}
    	}

    	get days() {
    		throw new Error("<Days>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set days(value) {
    		throw new Error("<Days>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var nf = {
    	name: "Netflix",
    	prelink: "https://www.netflix.com/search?q=",
    	postlink: ""
    };
    var be = {
    	name: "Behance",
    	prelink: "https://www.behance.net/search?search=",
    	postlink: ""
    };
    var git = {
    	name: "Github",
    	prelink: "https://github.com/search?&q=",
    	postlink: "",
    	me: "https://github.com/plutoniumblast?tab=repositories",
    	"new": "https://github.com/new",
    	settings: "https://github.com/settings/profile",
    	notifs: "https://github.com/notifications?query=is%3Aunread"
    };
    var g = {
    	name: "Google",
    	mail: "https://mail.google.com/",
    	prelink: "https://www.google.com/search?q=",
    	postlink: ""
    };
    var gi = {
    	name: "GImages",
    	prelink: "https://www.google.com/search?q=",
    	postlink: "&tbs=imgo:1,&tbm=isch"
    };
    var ddg = {
    	name: "DuckDuckGo",
    	prelink: "https://duckduckgo.com/?q=",
    	postlink: ""
    };
    var r = {
    	name: "Reddit",
    	prelink: "https://www.reddit.com/search?q=",
    	postlink: ""
    };
    var y = {
    	name: "Youtube",
    	prelink: "https://www.youtube.com/results?search_query=",
    	postlink: "",
    	"new": "https://www.youtube.com/feed/subscriptions"
    };
    var ig = {
    	name: "Instagram",
    	prelink: "https://www.google.com/search?q=",
    	postlink: " instagram",
    	me: "https://www.instagram.com/plutonium.rar/",
    	dm: "https://www.instagram.com/direct/inbox/"
    };
    var ap = {
    	name: "Amazon Prime",
    	prelink: "https://www.primevideo.com/search/ref=atv_nb_sr?phrase=",
    	postlink: "&ie=UTF8"
    };
    var imdb = {
    	name: "IMDB",
    	prelink: "https://www.imdb.com/find?q=",
    	postlink: "&ref_=nv_sr_sm"
    };
    var dict = {
    	name: "Merriam Webster",
    	prelink: "https://www.merriam-webster.com/dictionary/",
    	postlink: ""
    };
    var wiki = {
    	name: "Wikipedia",
    	prelink: "https://en.wikipedia.org/wiki/Special:Search?search=",
    	postlink: ""
    };
    var ht = {
    	name: "Web",
    	prelink: "https://",
    	postlink: ""
    };
    var htu = {
    	name: "Web",
    	prelink: "http://",
    	postlink: ""
    };
    var sites = {
    	nf: nf,
    	be: be,
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
    	now: "time.is",
    	mail: "https://www.icloud.com/mail/"
    },
    	ht: ht,
    	htu: htu
    };

    const startsWith = ( str, word ) => {
          return str.lastIndexOf( word, 0 ) === 0;
    };

    const preprocessor = ( key ) => {
          const sitFuncs = { "y": "window.location.href = send;" };
          const script = sitFuncs[ key ] || "window.location.href = send;";
          return script
    };

    const ms = ( milli ) => {
          let time = '<1 Day';
          const m = Math.round( milli / ( 60 * 1000 ) ) % 60;
          const h = Math.round( m / 60 ) % 24;
          const d = Math.round( h / 24 ) % 365;
          if ( h > 0 ) time = `${ h } h`;
          if ( d > 0 ) time += `${ d } d`;
          return time
    };

    /* src/components/notifs.svelte generated by Svelte v3.28.0 */
    const file$2 = "src/components/notifs.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (49:12) {#each notifs as notif}
    function create_each_block$1(ctx) {
    	let a;
    	let li;
    	let div2;
    	let div0;
    	let span0;
    	let t0_value = /*notif*/ ctx[2].repository.name + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = ms(new Date() - new Date(/*notif*/ ctx[2].updated_at)) + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*notif*/ ctx[2].subject.title + "";
    	let t4;
    	let t5;
    	let div3;
    	let t6_value = /*notif*/ ctx[2].subject.type + "";
    	let t6;
    	let t7;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			li = element("li");
    			div2 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(span0, file$2, 54, 42, 1438);
    			set_style(span1, "text-transform", "lowercase");
    			add_location(span1, file$2, 55, 42, 1517);
    			attr_dev(div0, "class", "head svelte-meyeaj");
    			add_location(div0, file$2, 53, 36, 1377);
    			attr_dev(div1, "class", "body");
    			add_location(div1, file$2, 58, 36, 1736);
    			add_location(div2, file$2, 52, 30, 1335);
    			attr_dev(div3, "class", "head svelte-meyeaj");
    			set_style(div3, "padding-top", "1em");
    			add_location(div3, file$2, 62, 30, 1929);
    			attr_dev(li, "class", "gitNotifs svelte-meyeaj");
    			add_location(li, file$2, 51, 24, 1282);
    			attr_dev(a, "href", a_href_value = "" + (/*notif*/ ctx[2].repository.owner.html_url + "/" + /*notif*/ ctx[2].repository.name));
    			add_location(a, file$2, 49, 18, 1165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, li);
    			append_dev(li, div2);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(span1, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(li, t5);
    			append_dev(li, div3);
    			append_dev(div3, t6);
    			append_dev(a, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*notifs*/ 1 && t0_value !== (t0_value = /*notif*/ ctx[2].repository.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*notifs*/ 1 && t2_value !== (t2_value = ms(new Date() - new Date(/*notif*/ ctx[2].updated_at)) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*notifs*/ 1 && t4_value !== (t4_value = /*notif*/ ctx[2].subject.title + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*notifs*/ 1 && t6_value !== (t6_value = /*notif*/ ctx[2].subject.type + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*notifs*/ 1 && a_href_value !== (a_href_value = "" + (/*notif*/ ctx[2].repository.owner.html_url + "/" + /*notif*/ ctx[2].repository.name))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(49:12) {#each notifs as notif}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let ul;
    	let each_value = /*notifs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-meyeaj");
    			add_location(ul, file$2, 47, 6, 1106);
    			set_style(section, "width", "100%");
    			add_location(section, file$2, 46, 0, 1071);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*notifs, ms, Date*/ 1) {
    				each_value = /*notifs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots("Notifs", slots, []);

    	if (window.Worker) {
    		let w = new Worker("./core/thread.js");
    		var msg = { func: "getTest" };
    		w.postMessage(msg);
    		w.onmessage = e => $$invalidate(0, notifs = e.data);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Notifs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ms, msg, notifs });

    	$$self.$inject_state = $$props => {
    		if ("msg" in $$props) msg = $$props.msg;
    		if ("notifs" in $$props) $$invalidate(0, notifs = $$props.notifs);
    	};

    	let notifs;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(0, notifs = []);
    	return [notifs];
    }

    class Notifs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifs",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/search.svelte generated by Svelte v3.28.0 */
    const file$3 = "src/components/search.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let br;
    	let t0;
    	let form;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let div2;
    	let ul;
    	let t4;
    	let div3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			br = element("br");
    			t0 = space();
    			form = element("form");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");
    			t4 = space();
    			div3 = element("div");
    			add_location(br, file$3, 148, 6, 5112);
    			if (img.src !== (img_src_value = "./icons/Basic.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1cipvz3");
    			add_location(img, file$3, 152, 24, 5281);
    			attr_dev(div0, "class", "icon");
    			add_location(div0, file$3, 151, 18, 5238);
    			attr_dev(input0, "id", "magic");
    			attr_dev(input0, "size", "100");
    			attr_dev(input0, "class", "svelte-1cipvz3");
    			add_location(input0, file$3, 154, 18, 5378);
    			attr_dev(div1, "class", "wrapper svelte-1cipvz3");
    			set_style(div1, "display", "flex");
    			add_location(div1, file$3, 150, 12, 5177);
    			attr_dev(input1, "type", "submit");
    			set_style(input1, "display", "none");
    			add_location(input1, file$3, 161, 12, 5610);
    			attr_dev(form, "class", "svelte-1cipvz3");
    			add_location(form, file$3, 149, 6, 5125);
    			attr_dev(ul, "id", "autoComplete");
    			attr_dev(ul, "class", "svelte-1cipvz3");
    			add_location(ul, file$3, 164, 12, 5756);
    			set_style(div2, "width", "calc(100% - 1em)");
    			set_style(div2, "padding", "0.5em");
    			set_style(div2, "margin-top", "0.5em");
    			add_location(div2, file$3, 163, 6, 5675);
    			attr_dev(div3, "id", "staticBox");
    			add_location(div3, file$3, 166, 6, 5800);
    			set_style(section, "display", "flex");
    			set_style(section, "justify-content", "center");
    			set_style(section, "align-items", "center");
    			set_style(section, "flex-direction", "column");
    			add_location(section, file$3, 146, 0, 5001);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, br);
    			append_dev(section, t0);
    			append_dev(section, form);
    			append_dev(form, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			/*img_binding*/ ctx[7](img);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			/*input0_binding*/ ctx[8](input0);
    			set_input_value(input0, /*raw*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, input1);
    			append_dev(section, t3);
    			append_dev(section, div2);
    			append_dev(div2, ul);
    			append_dev(section, t4);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, []);
    	let { sites } = $$props;
    	let raw = "", magic, ic, staticBox;

    	const fx = p => {
    		const val = +p.split(" ")[0];
    		const frm = p.split(" ")[1];
    		const fin = p.split(" ")[2];

    		fetch(`https://api.exchangerate-api.com/v4/latest/${frm}`).then(res => res.json()).then(res => {
    			const rate = res.rates[fin];
    			const ans = `${val} ${frm} = ${+rate * val} ${fin}`;
    			$$invalidate(3, staticBox.innerHTML += "<br>" + ans, staticBox);
    		});
    	};

    	const go = e => {
    		let term;

    		if (raw == "") {
    			document.getElementById("autoComplete").innerHTML = "";
    			$$invalidate(2, ic.src = `./icons/Basic.svg`, ic);
    		}

    		switch (e.keyCode) {
    			case 40:
    				suggI = suggI == 4 || suggI == null ? 0 : suggI + 1;
    				$$invalidate(1, magic.value = key + " " + suggList[suggI], magic);
    				break;
    			case 38:
    				suggI = suggI == 0 || suggI == null ? 4 : suggI - 1;
    				$$invalidate(1, magic.value = key + " " + suggList[suggI], magic);
    				break;
    			default:
    				suggI = null;
    				break;
    		}

    		term = magic.value.replace(key + " ", "");
    		if (term != "") sug(term);
    		send = sites[key].prelink + term + sites[key].postlink;

    		if (startsWith(raw, key + ":")) {
    			term = raw.replace(key + ":", "");
    			send = sites[key][term];
    		}

    		$$invalidate(2, ic.src = `./icons/${sites[key].name}.svg`, ic);
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

    	const sug = SIn => {
    		const sc_Old = document.getElementById("suggestions");
    		if (sc_Old) sc_Old.remove();
    		var sc = document.createElement("script");
    		sc.src = `https://clients1.google.com/complete/search?client=youtube&hl=en&q=${SIn}&jsonp=returnSug`;
    		sc.id = "suggestions";
    		document.body.appendChild(sc);
    	};

    	onMount(() => {
    		setTimeout(
    			() => {
    				magic.focus();
    			},
    			500
    		);
    	});

    	const writable_props = ["sites"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Search> was created with unknown prop '${key}'`);
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
    		sug,
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
    		if ($$self.$$.dirty & /*raw, sites*/ 65) {
    			 key = raw
    			? raw.split(":")[0].split(" ")[0].toLowerCase() in sites
    				? raw.split(":")[0].split(" ")[0].toLowerCase()
    				: "g"
    			: null;
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { sites: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sites*/ ctx[6] === undefined && !("sites" in props)) {
    			console.warn("<Search> was created without expected prop 'sites'");
    		}
    	}

    	get sites() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sites(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/micro/quick.svelte generated by Svelte v3.28.0 */

    const file$4 = "src/micro/quick.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let a;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let span;
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
    			span = element("span");
    			t1 = text(t1_value);
    			if (img.src !== (img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "onerror", "this.onerror=null;this.src='./assets/link.png';");
    			attr_dev(img, "alt", img_alt_value = /*link*/ ctx[0].name);
    			attr_dev(img, "class", "svelte-nnm6qi");
    			add_location(img, file$4, 38, 18, 966);
    			add_location(div0, file$4, 37, 12, 942);
    			set_style(span, "font-size", "0.75em");
    			set_style(span, "color", "#ddd");
    			add_location(span, file$4, 44, 12, 1202);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[0].link);
    			attr_dev(a, "class", "svelte-nnm6qi");
    			add_location(a, file$4, 36, 6, 909);
    			attr_dev(div1, "class", "quick svelte-nnm6qi");
    			add_location(div1, file$4, 35, 0, 883);
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
    			append_dev(a, span);
    			append_dev(span, t1);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const fallback = "./assets/link.png";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Quick", slots, []);
    	let { link } = $$props;
    	let linkImg;
    	var favi = link.link.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0];

    	fetch("http://favicongrabber.com/api/grab/" + favi).then(r => r.json()).then(fi => {
    		if (fi) {
    			$$invalidate(1, linkImg.src = fi.icons[fi.icons.length - 1].src, linkImg);
    		} else {
    			$$invalidate(1, linkImg.src = fallback, linkImg);
    		}
    	}).catch(e => $$invalidate(1, linkImg.src = fallback, linkImg));

    	const writable_props = ["link"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Quick> was created with unknown prop '${key}'`);
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

    	$$self.$capture_state = () => ({ link, linkImg, fallback, favi });

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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quick",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !("link" in props)) {
    			console.warn("<Quick> was created without expected prop 'link'");
    		}
    	}

    	get link() {
    		throw new Error("<Quick>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Quick>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/links.svelte generated by Svelte v3.28.0 */
    const file$5 = "src/components/links.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (25:12) {#each data as link}
    function create_each_block$2(ctx) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(25:12) {#each data as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let section;
    	let div;
    	let current;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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

    			attr_dev(div, "class", "quickCont svelte-c600eo");
    			set_style(div, "width", "80%");
    			add_location(div, file$5, 23, 6, 421);
    			attr_dev(section, "class", "links svelte-c600eo");
    			set_style(section, "width", "100%");
    			add_location(section, file$5, 22, 0, 372);
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
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Links", slots, []);
    	let { data } = $$props;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Links> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Links",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Links> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Links>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Links>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.28.0 */
    const file$6 = "src/App.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let search;
    	let t1;
    	let days_1;
    	let t2;
    	let notifs;
    	let t3;
    	let links_1;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	search = new Search({
    			props: { sites: /*sites*/ ctx[0] },
    			$$inline: true
    		});

    	days_1 = new Days({
    			props: { days: /*days*/ ctx[1] },
    			$$inline: true
    		});

    	notifs = new Notifs({ $$inline: true });

    	links_1 = new Links({
    			props: { data: /*links*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(search.$$.fragment);
    			t1 = space();
    			create_component(days_1.$$.fragment);
    			t2 = space();
    			create_component(notifs.$$.fragment);
    			t3 = space();
    			create_component(links_1.$$.fragment);
    			add_location(main, file$6, 16, 0, 349);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			mount_component(search, main, null);
    			append_dev(main, t1);
    			mount_component(days_1, main, null);
    			append_dev(main, t2);
    			mount_component(notifs, main, null);
    			append_dev(main, t3);
    			mount_component(links_1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const search_changes = {};
    			if (dirty & /*sites*/ 1) search_changes.sites = /*sites*/ ctx[0];
    			search.$set(search_changes);
    			const days_1_changes = {};
    			if (dirty & /*days*/ 2) days_1_changes.days = /*days*/ ctx[1];
    			days_1.$set(days_1_changes);
    			const links_1_changes = {};
    			if (dirty & /*links*/ 4) links_1_changes.data = /*links*/ ctx[2];
    			links_1.$set(links_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(search.$$.fragment, local);
    			transition_in(days_1.$$.fragment, local);
    			transition_in(notifs.$$.fragment, local);
    			transition_in(links_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(search.$$.fragment, local);
    			transition_out(days_1.$$.fragment, local);
    			transition_out(notifs.$$.fragment, local);
    			transition_out(links_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(search);
    			destroy_component(days_1);
    			destroy_component(notifs);
    			destroy_component(links_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { sites } = $$props, { days } = $$props, { links } = $$props;
    	const writable_props = ["sites", "days", "links"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("sites" in $$props) $$invalidate(0, sites = $$props.sites);
    		if ("days" in $$props) $$invalidate(1, days = $$props.days);
    		if ("links" in $$props) $$invalidate(2, links = $$props.links);
    	};

    	$$self.$capture_state = () => ({
    		sites,
    		days,
    		links,
    		Navbar,
    		Days,
    		Notifs,
    		Search,
    		Links
    	});

    	$$self.$inject_state = $$props => {
    		if ("sites" in $$props) $$invalidate(0, sites = $$props.sites);
    		if ("days" in $$props) $$invalidate(1, days = $$props.days);
    		if ("links" in $$props) $$invalidate(2, links = $$props.links);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sites, days, links];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { sites: 0, days: 1, links: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sites*/ ctx[0] === undefined && !("sites" in props)) {
    			console.warn("<App> was created without expected prop 'sites'");
    		}

    		if (/*days*/ ctx[1] === undefined && !("days" in props)) {
    			console.warn("<App> was created without expected prop 'days'");
    		}

    		if (/*links*/ ctx[2] === undefined && !("links" in props)) {
    			console.warn("<App> was created without expected prop 'links'");
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
    	props: { sites: sites, days: days, links: links }
    } );

    return app;

}());
