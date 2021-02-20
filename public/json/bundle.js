
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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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

    const sourcer = ( src ) => {
        if ( src == "DC++" ) return "DCpp";
        if ( src == "AppleTV+" ) return "Apple";
        if ( src == "PrimeVideo" ) return "Amazon";
        if ( src == "Hotstar" ) return "Disney";
        if ( src == "KissMovies" || src == "KissAnime" ) return "Web";
        else return src;
    };

    const histSearch = ( show, state ) => {
        // GRADE
        if ( state.charAt( 0 ) == ">" ) return +show.grade > state.charAt( 1 ) ? 1 : 0;
        if ( state.charAt( 0 ) == "<" ) return +show.grade < state.charAt( 1 ) ? 1 : 0;

        // DATE
        if ( state.split( " " )[ 0 ] == "since" && +( state.split( " " )[ 1 ] ) > 1.9e3 ) return +show.release >= +( state.split( " " )[ 1 ] ) ? 1 : 0;
        if ( state.split( " " )[ 0 ] == "till" && +( state.split( " " )[ 1 ] ) > 1.9e3 ) return +show.release <= +( state.split( " " )[ 1 ] ) ? 1 : 0;

        return ( (
            show.record.toLowerCase().includes( state ) ||
            show.source.toLowerCase().includes( state ) ||
            show.type.toLowerCase().includes( state ) )
            ? 1 : 0 );
    };

    /* json/components/multiple.svelte generated by Svelte v3.29.0 */
    const file = "json/components/multiple.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (93:0) {#each set.filter((e) => {     if (state != "") return histSearch(e, state);     else return 1; }) as show}
    function create_each_block(ctx) {
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;

    	let t1_value = (/*show*/ ctx[7].record.length > 20
    	? /*show*/ ctx[7].record.slice(0, 20) + "..."
    	: /*show*/ ctx[7].record) + "";

    	let t1;
    	let t2;
    	let svg;
    	let text_1;
    	let t3_value = /*show*/ ctx[7].speed + "";
    	let t3;
    	let t4;
    	let div1;
    	let t5_value = /*show*/ ctx[7].grade + "";
    	let t5;
    	let t6;
    	let div2;

    	let t7_value = new Date(/*show*/ ctx[7].day).toLocaleString("en-US", {
    		weekday: "short",
    		year: "numeric",
    		month: "short",
    		day: "numeric"
    	}) + "";

    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			svg = svg_element("svg");
    			text_1 = svg_element("text");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			if (img.src !== (img_src_value = "./icons/" + sourcer(/*show*/ ctx[7].source) + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-24a27w");
    			add_location(img, file, 98, 12, 2889);
    			set_style(span, "font-size", "1.25em");
    			set_style(span, "text-format", "capitalize");
    			add_location(span, file, 99, 12, 2957);
    			attr_dev(text_1, "x", "8");
    			attr_dev(text_1, "y", "18");
    			attr_dev(text_1, "fill", "#fff");
    			add_location(text_1, file, 105, 16, 3240);
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "viewBox", "0 0 40 25");
    			attr_dev(svg, "class", "svelte-24a27w");
    			add_location(svg, file, 104, 12, 3175);
    			attr_dev(div0, "class", "main w-33 svelte-24a27w");
    			add_location(div0, file, 97, 8, 2853);
    			attr_dev(div1, "class", "w-33 t-rhs");
    			add_location(div1, file, 108, 8, 3333);
    			attr_dev(div2, "class", "w-33 t-rhs");
    			add_location(div2, file, 109, 8, 3384);
    			attr_dev(div3, "class", "boxes blurW");
    			add_location(div3, file, 96, 4, 2819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(div0, t2);
    			append_dev(div0, svg);
    			append_dev(svg, text_1);
    			append_dev(text_1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, t7);
    			append_dev(div3, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*set, state*/ 3 && img.src !== (img_src_value = "./icons/" + sourcer(/*show*/ ctx[7].source) + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*set, state*/ 3 && t1_value !== (t1_value = (/*show*/ ctx[7].record.length > 20
    			? /*show*/ ctx[7].record.slice(0, 20) + "..."
    			: /*show*/ ctx[7].record) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*set, state*/ 3 && t3_value !== (t3_value = /*show*/ ctx[7].speed + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*set, state*/ 3 && t5_value !== (t5_value = /*show*/ ctx[7].grade + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*set, state*/ 3 && t7_value !== (t7_value = new Date(/*show*/ ctx[7].day).toLocaleString("en-US", {
    				weekday: "short",
    				year: "numeric",
    				month: "short",
    				day: "numeric"
    			}) + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(93:0) {#each set.filter((e) => {     if (state != \\\"\\\") return histSearch(e, state);     else return 1; }) as show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let form_1;
    	let div0;
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let span1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let span2;
    	let t7;
    	let input2;
    	let input2_max_value;
    	let t8;
    	let div3;
    	let span3;
    	let t10;
    	let input3;
    	let t11;
    	let div4;
    	let span4;
    	let t13;
    	let input4;
    	let t14;
    	let div5;
    	let span5;
    	let t16;
    	let input5;
    	let t17;
    	let div6;
    	let span6;
    	let t19;
    	let input6;
    	let input6_value_value;
    	let t20;
    	let input7;
    	let t21;
    	let div7;
    	let span7;
    	let t23;
    	let input8;
    	let t24;
    	let br;
    	let t25;
    	let each_1_anchor;
    	let mounted;
    	let dispose;
    	let each_value = /*set*/ ctx[0].filter(/*func*/ ctx[5]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Name";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "Type";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			span2 = element("span");
    			span2.textContent = "Released";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			span3 = element("span");
    			span3.textContent = "Grade";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div4 = element("div");
    			span4 = element("span");
    			span4.textContent = "Speed";
    			t13 = space();
    			input4 = element("input");
    			t14 = space();
    			div5 = element("div");
    			span5 = element("span");
    			span5.textContent = "Source";
    			t16 = space();
    			input5 = element("input");
    			t17 = space();
    			div6 = element("div");
    			span6 = element("span");
    			span6.textContent = "Today";
    			t19 = space();
    			input6 = element("input");
    			t20 = space();
    			input7 = element("input");
    			t21 = space();
    			div7 = element("div");
    			span7 = element("span");
    			span7.textContent = "Status";
    			t23 = space();
    			input8 = element("input");
    			t24 = space();
    			br = element("br");
    			t25 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(span0, "class", "label");
    			add_location(span0, file, 46, 8, 1225);
    			attr_dev(input0, "name", "record");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "grade svelte-24a27w");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file, 47, 8, 1265);
    			attr_dev(div0, "class", "inp-cont svelte-24a27w");
    			add_location(div0, file, 45, 4, 1194);
    			attr_dev(span1, "class", "label");
    			add_location(span1, file, 50, 8, 1380);
    			attr_dev(input1, "name", "type");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "grade svelte-24a27w");
    			input1.value = "Web Series";
    			add_location(input1, file, 51, 8, 1420);
    			attr_dev(div1, "class", "inp-cont svelte-24a27w");
    			add_location(div1, file, 49, 4, 1349);
    			attr_dev(span2, "class", "label");
    			add_location(span2, file, 54, 8, 1533);
    			attr_dev(input2, "name", "release");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "grade svelte-24a27w");
    			attr_dev(input2, "min", "1930");
    			input2.value = "2017";
    			attr_dev(input2, "max", input2_max_value = new Date().getFullYear());
    			add_location(input2, file, 55, 8, 1577);
    			attr_dev(div2, "class", "inp-cont svelte-24a27w");
    			add_location(div2, file, 53, 4, 1502);
    			attr_dev(span3, "class", "label");
    			add_location(span3, file, 65, 8, 1811);
    			attr_dev(input3, "name", "grade");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "grade svelte-24a27w");
    			input3.value = "5";
    			add_location(input3, file, 66, 8, 1852);
    			attr_dev(div3, "class", "inp-cont svelte-24a27w");
    			add_location(div3, file, 64, 4, 1780);
    			attr_dev(span4, "class", "label");
    			add_location(span4, file, 69, 8, 1957);
    			attr_dev(input4, "name", "speed");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "grade svelte-24a27w");
    			input4.value = "1.6";
    			add_location(input4, file, 70, 8, 1998);
    			attr_dev(div4, "class", "inp-cont svelte-24a27w");
    			add_location(div4, file, 68, 4, 1926);
    			attr_dev(span5, "class", "label");
    			add_location(span5, file, 73, 8, 2105);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "name", "source");
    			attr_dev(input5, "class", "grade svelte-24a27w");
    			input5.value = "Netflix";
    			add_location(input5, file, 74, 8, 2147);
    			attr_dev(div5, "class", "inp-cont svelte-24a27w");
    			add_location(div5, file, 72, 4, 2074);
    			attr_dev(span6, "class", "label");
    			add_location(span6, file, 77, 8, 2259);
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "name", "date");
    			input6.value = input6_value_value = new Date().toLocaleDateString("en-US");
    			attr_dev(input6, "class", "grade svelte-24a27w");
    			add_location(input6, file, 78, 8, 2300);
    			attr_dev(input7, "type", "submit");
    			input7.value = "submit";
    			set_style(input7, "opacity", "0");
    			set_style(input7, "width", "0");
    			attr_dev(input7, "class", "svelte-24a27w");
    			add_location(input7, file, 84, 8, 2459);
    			attr_dev(div6, "class", "inp-cont svelte-24a27w");
    			add_location(div6, file, 76, 4, 2228);
    			attr_dev(span7, "class", "label");
    			add_location(span7, file, 87, 8, 2571);
    			attr_dev(input8, "type", "text");
    			attr_dev(input8, "name", "status");
    			input8.value = "Completed";
    			attr_dev(input8, "class", "grade svelte-24a27w");
    			add_location(input8, file, 88, 8, 2613);
    			attr_dev(div7, "class", "inp-cont svelte-24a27w");
    			add_location(div7, file, 86, 4, 2540);
    			attr_dev(form_1, "class", "boxes blurW");
    			add_location(form_1, file, 44, 0, 1114);
    			add_location(br, file, 91, 0, 2700);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			append_dev(form_1, t2);
    			append_dev(form_1, div1);
    			append_dev(div1, span1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			append_dev(form_1, t5);
    			append_dev(form_1, div2);
    			append_dev(div2, span2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			append_dev(form_1, t8);
    			append_dev(form_1, div3);
    			append_dev(div3, span3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			append_dev(form_1, t11);
    			append_dev(form_1, div4);
    			append_dev(div4, span4);
    			append_dev(div4, t13);
    			append_dev(div4, input4);
    			append_dev(form_1, t14);
    			append_dev(form_1, div5);
    			append_dev(div5, span5);
    			append_dev(div5, t16);
    			append_dev(div5, input5);
    			append_dev(form_1, t17);
    			append_dev(form_1, div6);
    			append_dev(div6, span6);
    			append_dev(div6, t19);
    			append_dev(div6, input6);
    			append_dev(div6, t20);
    			append_dev(div6, input7);
    			append_dev(form_1, t21);
    			append_dev(form_1, div7);
    			append_dev(div7, span7);
    			append_dev(div7, t23);
    			append_dev(div7, input8);
    			/*form_1_binding*/ ctx[4](form_1);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t25, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(form_1, "submit", prevent_default(/*send*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Date, set, state, histSearch, sourcer*/ 3) {
    				each_value = /*set*/ ctx[0].filter(/*func*/ ctx[5]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			if (detaching) detach_dev(form_1);
    			/*form_1_binding*/ ctx[4](null);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t25);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			mounted = false;
    			dispose();
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Multiple", slots, []);
    	let { set } = $$props, { state } = $$props;
    	let form;

    	class Show {
    		constructor(day, typ, rec, yr, grd, src, tags, x, stt) {
    			this.day = new Date(day).toLocaleDateString("en-US");
    			this.type = typ;
    			this.record = rec;
    			this.release = yr;
    			this.grade = grd;
    			this.source = src;
    			this.tags = tags;
    			this.speed = x;
    			this.state = stt;
    		}
    	}

    	const send = () => {
    		const fr = t => new FormData(form).get(t);
    		const show = new Show(fr("date"), fr("type"), fr("record"), fr("release"), fr("grade"), fr("source"), fr("tags"), fr("speed"), fr("status"));
    		$$invalidate(0, set = [show, ...set]);

    		fetch("/json/multiple", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify(show)
    		});
    	};

    	const writable_props = ["set", "state"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Multiple> was created with unknown prop '${key}'`);
    	});

    	function form_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			form = $$value;
    			$$invalidate(2, form);
    		});
    	}

    	const func = e => {
    		if (state != "") return histSearch(e, state); else return 1;
    	};

    	$$self.$$set = $$props => {
    		if ("set" in $$props) $$invalidate(0, set = $$props.set);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		set,
    		state,
    		form,
    		sourcer,
    		histSearch,
    		Show,
    		send
    	});

    	$$self.$inject_state = $$props => {
    		if ("set" in $$props) $$invalidate(0, set = $$props.set);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("form" in $$props) $$invalidate(2, form = $$props.form);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [set, state, form, send, form_1_binding, func];
    }

    class Multiple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { set: 0, state: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Multiple",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*set*/ ctx[0] === undefined && !("set" in props)) {
    			console.warn("<Multiple> was created without expected prop 'set'");
    		}

    		if (/*state*/ ctx[1] === undefined && !("state" in props)) {
    			console.warn("<Multiple> was created without expected prop 'state'");
    		}
    	}

    	get set() {
    		throw new Error("<Multiple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Multiple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Multiple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Multiple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* json/components/single.svelte generated by Svelte v3.29.0 */
    const file$1 = "json/components/single.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (82:0) {#each set.filter((e) => {     if (state != "") return histSearch(e, state);     else return 1; }) as show}
    function create_each_block$1(ctx) {
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;

    	let t1_value = (/*show*/ ctx[3].record.length > 20
    	? /*show*/ ctx[3].record.slice(0, 20) + "..."
    	: /*show*/ ctx[3].record) + "";

    	let t1;
    	let t2;
    	let svg;
    	let text_1;
    	let t3_value = /*show*/ ctx[3].speed + "";
    	let t3;
    	let t4;
    	let div1;
    	let t5_value = /*show*/ ctx[3].grade + "";
    	let t5;
    	let t6;
    	let div2;

    	let t7_value = new Date(/*show*/ ctx[3].day).toLocaleString("en-GB", {
    		weekday: "short",
    		year: "numeric",
    		month: "short",
    		day: "numeric"
    	}) + "";

    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			svg = svg_element("svg");
    			text_1 = svg_element("text");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			if (img.src !== (img_src_value = "./icons/" + sourcer(/*show*/ ctx[3].source) + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-24a27w");
    			add_location(img, file$1, 87, 12, 2608);
    			set_style(span, "font-size", "1.25em");
    			set_style(span, "text-format", "capitalize");
    			add_location(span, file$1, 88, 12, 2676);
    			attr_dev(text_1, "x", "8");
    			attr_dev(text_1, "y", "18");
    			attr_dev(text_1, "fill", "#fff");
    			add_location(text_1, file$1, 99, 16, 3094);
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "viewBox", "0 0 40 25");
    			set_style(svg, "background", "#888");
    			set_style(svg, "border-radius", "8px");
    			set_style(svg, "margin", "3px 5px");
    			attr_dev(svg, "class", "svelte-24a27w");
    			add_location(svg, file$1, 93, 12, 2894);
    			attr_dev(div0, "class", "main w-33 svelte-24a27w");
    			add_location(div0, file$1, 86, 8, 2572);
    			attr_dev(div1, "class", "w-33 t-rhs");
    			add_location(div1, file$1, 102, 8, 3187);
    			attr_dev(div2, "class", "w-33 t-rhs");
    			add_location(div2, file$1, 103, 8, 3238);
    			attr_dev(div3, "class", "boxes blurW");
    			add_location(div3, file$1, 85, 4, 2538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(div0, t2);
    			append_dev(div0, svg);
    			append_dev(svg, text_1);
    			append_dev(text_1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, t7);
    			append_dev(div3, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*set, state*/ 3 && img.src !== (img_src_value = "./icons/" + sourcer(/*show*/ ctx[3].source) + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*set, state*/ 3 && t1_value !== (t1_value = (/*show*/ ctx[3].record.length > 20
    			? /*show*/ ctx[3].record.slice(0, 20) + "..."
    			: /*show*/ ctx[3].record) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*set, state*/ 3 && t3_value !== (t3_value = /*show*/ ctx[3].speed + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*set, state*/ 3 && t5_value !== (t5_value = /*show*/ ctx[3].grade + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*set, state*/ 3 && t7_value !== (t7_value = new Date(/*show*/ ctx[3].day).toLocaleString("en-GB", {
    				weekday: "short",
    				year: "numeric",
    				month: "short",
    				day: "numeric"
    			}) + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(82:0) {#each set.filter((e) => {     if (state != \\\"\\\") return histSearch(e, state);     else return 1; }) as show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let form_1;
    	let div0;
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let span1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let span2;
    	let t7;
    	let input2;
    	let t8;
    	let div3;
    	let span3;
    	let t10;
    	let input3;
    	let t11;
    	let div4;
    	let span4;
    	let t13;
    	let input4;
    	let t14;
    	let div5;
    	let span5;
    	let t16;
    	let input5;
    	let t17;
    	let div6;
    	let span6;
    	let t19;
    	let input6;
    	let t20;
    	let input7;
    	let t21;
    	let each_1_anchor;
    	let mounted;
    	let dispose;
    	let each_value = /*set*/ ctx[0].filter(/*func*/ ctx[13]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Name";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "Type";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			span2 = element("span");
    			span2.textContent = "Released";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			span3 = element("span");
    			span3.textContent = "Grade";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div4 = element("div");
    			span4 = element("span");
    			span4.textContent = "Speed";
    			t13 = space();
    			input4 = element("input");
    			t14 = space();
    			div5 = element("div");
    			span5 = element("span");
    			span5.textContent = "Source";
    			t16 = space();
    			input5 = element("input");
    			t17 = space();
    			div6 = element("div");
    			span6 = element("span");
    			span6.textContent = "Today";
    			t19 = space();
    			input6 = element("input");
    			t20 = space();
    			input7 = element("input");
    			t21 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(span0, "class", "label");
    			add_location(span0, file$1, 52, 8, 1347);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "grade svelte-24a27w");
    			add_location(input0, file$1, 53, 8, 1387);
    			attr_dev(div0, "class", "inp-cont svelte-24a27w");
    			add_location(div0, file$1, 51, 4, 1316);
    			attr_dev(span1, "class", "label");
    			add_location(span1, file$1, 56, 8, 1494);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "grade svelte-24a27w");
    			add_location(input1, file$1, 57, 8, 1534);
    			attr_dev(div1, "class", "inp-cont svelte-24a27w");
    			add_location(div1, file$1, 55, 4, 1463);
    			attr_dev(span2, "class", "label");
    			add_location(span2, file$1, 60, 8, 1639);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "grade svelte-24a27w");
    			add_location(input2, file$1, 61, 8, 1683);
    			attr_dev(div2, "class", "inp-cont svelte-24a27w");
    			add_location(div2, file$1, 59, 4, 1608);
    			attr_dev(span3, "class", "label");
    			add_location(span3, file$1, 64, 8, 1791);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "grade svelte-24a27w");
    			add_location(input3, file$1, 65, 8, 1832);
    			attr_dev(div3, "class", "inp-cont svelte-24a27w");
    			add_location(div3, file$1, 63, 4, 1760);
    			attr_dev(span4, "class", "label");
    			add_location(span4, file$1, 68, 8, 1938);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "grade svelte-24a27w");
    			add_location(input4, file$1, 69, 8, 1979);
    			attr_dev(div4, "class", "inp-cont svelte-24a27w");
    			add_location(div4, file$1, 67, 4, 1907);
    			attr_dev(span5, "class", "label");
    			add_location(span5, file$1, 72, 8, 2085);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "class", "grade svelte-24a27w");
    			add_location(input5, file$1, 73, 8, 2127);
    			attr_dev(div5, "class", "inp-cont svelte-24a27w");
    			add_location(div5, file$1, 71, 4, 2054);
    			attr_dev(span6, "class", "label");
    			add_location(span6, file$1, 76, 8, 2234);
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "class", "grade svelte-24a27w");
    			add_location(input6, file$1, 77, 8, 2275);
    			attr_dev(input7, "type", "submit");
    			input7.value = "submit";
    			set_style(input7, "opacity", "0");
    			set_style(input7, "width", "0");
    			attr_dev(input7, "class", "svelte-24a27w");
    			add_location(input7, file$1, 78, 8, 2341);
    			attr_dev(div6, "class", "inp-cont svelte-24a27w");
    			add_location(div6, file$1, 75, 4, 2203);
    			attr_dev(form_1, "class", "boxes blurW");
    			add_location(form_1, file$1, 50, 0, 1236);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*show*/ ctx[3].record);
    			append_dev(form_1, t2);
    			append_dev(form_1, div1);
    			append_dev(div1, span1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*show*/ ctx[3].type);
    			append_dev(form_1, t5);
    			append_dev(form_1, div2);
    			append_dev(div2, span2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			set_input_value(input2, /*show*/ ctx[3].release);
    			append_dev(form_1, t8);
    			append_dev(form_1, div3);
    			append_dev(div3, span3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			set_input_value(input3, /*show*/ ctx[3].grade);
    			append_dev(form_1, t11);
    			append_dev(form_1, div4);
    			append_dev(div4, span4);
    			append_dev(div4, t13);
    			append_dev(div4, input4);
    			set_input_value(input4, /*show*/ ctx[3].speed);
    			append_dev(form_1, t14);
    			append_dev(form_1, div5);
    			append_dev(div5, span5);
    			append_dev(div5, t16);
    			append_dev(div5, input5);
    			set_input_value(input5, /*show*/ ctx[3].source);
    			append_dev(form_1, t17);
    			append_dev(form_1, div6);
    			append_dev(div6, span6);
    			append_dev(div6, t19);
    			append_dev(div6, input6);
    			set_input_value(input6, /*show*/ ctx[3].day);
    			append_dev(div6, t20);
    			append_dev(div6, input7);
    			/*form_1_binding*/ ctx[12](form_1);
    			insert_dev(target, t21, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[8]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[9]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[10]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[11]),
    					listen_dev(form_1, "submit", prevent_default(/*send*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*show*/ 8 && input0.value !== /*show*/ ctx[3].record) {
    				set_input_value(input0, /*show*/ ctx[3].record);
    			}

    			if (dirty & /*show*/ 8 && input1.value !== /*show*/ ctx[3].type) {
    				set_input_value(input1, /*show*/ ctx[3].type);
    			}

    			if (dirty & /*show*/ 8 && input2.value !== /*show*/ ctx[3].release) {
    				set_input_value(input2, /*show*/ ctx[3].release);
    			}

    			if (dirty & /*show*/ 8 && input3.value !== /*show*/ ctx[3].grade) {
    				set_input_value(input3, /*show*/ ctx[3].grade);
    			}

    			if (dirty & /*show*/ 8 && input4.value !== /*show*/ ctx[3].speed) {
    				set_input_value(input4, /*show*/ ctx[3].speed);
    			}

    			if (dirty & /*show*/ 8 && input5.value !== /*show*/ ctx[3].source) {
    				set_input_value(input5, /*show*/ ctx[3].source);
    			}

    			if (dirty & /*show*/ 8 && input6.value !== /*show*/ ctx[3].day) {
    				set_input_value(input6, /*show*/ ctx[3].day);
    			}

    			if (dirty & /*Date, set, state, histSearch, sourcer*/ 3) {
    				each_value = /*set*/ ctx[0].filter(/*func*/ ctx[13]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			if (detaching) detach_dev(form_1);
    			/*form_1_binding*/ ctx[12](null);
    			if (detaching) detach_dev(t21);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("Single", slots, []);
    	let { set } = $$props, { state } = $$props;
    	let form;

    	class Movie {
    		constructor(day, typ, rec, yr, grd, src, x) {
    			this.day = new Date(day).toLocaleDateString("en-US");
    			this.type = typ;
    			this.record = rec;
    			this.release = yr;
    			this.grade = grd;
    			this.source = src;
    			this.speed = x;
    		}
    	}

    	const send = () => {
    		const fr = t => new FormData(form).get(t);
    		const show2 = new Movie(fr("date"), fr("type"), fr("record"), fr("release"), fr("grade"), fr("source"), fr("speed"));
    		const t = show;
    		$$invalidate(0, set = [t, ...set]);

    		fetch("/json/single", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify(show)
    		});
    	};

    	let show = {
    		day: new Date().toLocaleDateString("en-US"),
    		type: "Documentary",
    		record: "Name",
    		release: "201",
    		grade: 5,
    		source: "Netflix",
    		speed: "1.8"
    	};

    	const writable_props = ["set", "state"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Single> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		show.record = this.value;
    		$$invalidate(3, show);
    	}

    	function input1_input_handler() {
    		show.type = this.value;
    		$$invalidate(3, show);
    	}

    	function input2_input_handler() {
    		show.release = this.value;
    		$$invalidate(3, show);
    	}

    	function input3_input_handler() {
    		show.grade = this.value;
    		$$invalidate(3, show);
    	}

    	function input4_input_handler() {
    		show.speed = this.value;
    		$$invalidate(3, show);
    	}

    	function input5_input_handler() {
    		show.source = this.value;
    		$$invalidate(3, show);
    	}

    	function input6_input_handler() {
    		show.day = this.value;
    		$$invalidate(3, show);
    	}

    	function form_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			form = $$value;
    			$$invalidate(2, form);
    		});
    	}

    	const func = e => {
    		if (state != "") return histSearch(e, state); else return 1;
    	};

    	$$self.$$set = $$props => {
    		if ("set" in $$props) $$invalidate(0, set = $$props.set);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		set,
    		state,
    		form,
    		sourcer,
    		histSearch,
    		Movie,
    		send,
    		show
    	});

    	$$self.$inject_state = $$props => {
    		if ("set" in $$props) $$invalidate(0, set = $$props.set);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("form" in $$props) $$invalidate(2, form = $$props.form);
    		if ("show" in $$props) $$invalidate(3, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		set,
    		state,
    		form,
    		show,
    		send,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		form_1_binding,
    		func
    	];
    }

    class Single extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { set: 0, state: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Single",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*set*/ ctx[0] === undefined && !("set" in props)) {
    			console.warn("<Single> was created without expected prop 'set'");
    		}

    		if (/*state*/ ctx[1] === undefined && !("state" in props)) {
    			console.warn("<Single> was created without expected prop 'state'");
    		}
    	}

    	get set() {
    		throw new Error("<Single>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Single>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Single>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Single>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* json/components/track.svelte generated by Svelte v3.29.0 */
    const file$2 = "json/components/track.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (61:4) {#each set as show}
    function create_each_block$2(ctx) {
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;

    	let t1_value = (/*show*/ ctx[1].record.length > 20
    	? /*show*/ ctx[1].record.slice(0, 20) + "..."
    	: /*show*/ ctx[1].record) + "";

    	let t1;
    	let t2;
    	let t3_value = /*show*/ ctx[1].release + "";
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let t6_value = /*show*/ ctx[1].stars + "";
    	let t6;
    	let t7;
    	let div2;
    	let t8_value = /*show*/ ctx[1].size + "";
    	let t8;
    	let t9;
    	let div3;
    	let t10;
    	let t11_value = /*show*/ ctx[1].type + "";
    	let t11;
    	let t12;
    	let t13_value = /*show*/ ctx[1].why + "";
    	let t13;
    	let t14;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(" (");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			div1 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div3 = element("div");
    			t10 = text("(");
    			t11 = text(t11_value);
    			t12 = text(") ");
    			t13 = text(t13_value);
    			t14 = space();
    			if (img.src !== (img_src_value = "./icons/" + sourcer(/*show*/ ctx[1].source) + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-24a27w");
    			add_location(img, file$2, 63, 16, 1991);
    			set_style(span, "font-size", "1.25em");
    			set_style(span, "text-format", "capitalize");
    			add_location(span, file$2, 64, 16, 2063);
    			attr_dev(div0, "class", "main w-33 svelte-24a27w");
    			add_location(div0, file$2, 62, 12, 1951);
    			attr_dev(div1, "class", "w-33 t-rhs");
    			add_location(div1, file$2, 70, 12, 2333);
    			attr_dev(div2, "class", "w-33 t-rhs");
    			add_location(div2, file$2, 71, 12, 2388);
    			attr_dev(div3, "class", "w-33 t-rhs");
    			add_location(div3, file$2, 72, 12, 2442);
    			attr_dev(div4, "class", "boxes blurW");
    			add_location(div4, file$2, 61, 8, 1913);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			append_dev(div1, t6);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, t8);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div4, t14);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*set*/ 1 && img.src !== (img_src_value = "./icons/" + sourcer(/*show*/ ctx[1].source) + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*set*/ 1 && t1_value !== (t1_value = (/*show*/ ctx[1].record.length > 20
    			? /*show*/ ctx[1].record.slice(0, 20) + "..."
    			: /*show*/ ctx[1].record) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*set*/ 1 && t3_value !== (t3_value = /*show*/ ctx[1].release + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*set*/ 1 && t6_value !== (t6_value = /*show*/ ctx[1].stars + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*set*/ 1 && t8_value !== (t8_value = /*show*/ ctx[1].size + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*set*/ 1 && t11_value !== (t11_value = /*show*/ ctx[1].type + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*set*/ 1 && t13_value !== (t13_value = /*show*/ ctx[1].why + "")) set_data_dev(t13, t13_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(61:4) {#each set as show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let form;
    	let div0;
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let span1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let span2;
    	let t7;
    	let input2;
    	let t8;
    	let div3;
    	let span3;
    	let t10;
    	let input3;
    	let t11;
    	let div4;
    	let span4;
    	let t13;
    	let input4;
    	let t14;
    	let div5;
    	let span5;
    	let t16;
    	let input5;
    	let t17;
    	let div6;
    	let span6;
    	let t19;
    	let input6;
    	let t20;
    	let input7;
    	let t21;
    	let br;
    	let t22;
    	let mounted;
    	let dispose;
    	let each_value = /*set*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			form = element("form");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Type";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "Name";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			span2 = element("span");
    			span2.textContent = "Released";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			span3 = element("span");
    			span3.textContent = "Source";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div4 = element("div");
    			span4 = element("span");
    			span4.textContent = "Size";
    			t13 = space();
    			input4 = element("input");
    			t14 = space();
    			div5 = element("div");
    			span5 = element("span");
    			span5.textContent = "Stars";
    			t16 = space();
    			input5 = element("input");
    			t17 = space();
    			div6 = element("div");
    			span6 = element("span");
    			span6.textContent = "Why";
    			t19 = space();
    			input6 = element("input");
    			t20 = space();
    			input7 = element("input");
    			t21 = space();
    			br = element("br");
    			t22 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span0, "class", "label");
    			add_location(span0, file$2, 30, 12, 683);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "grade svelte-24a27w");
    			add_location(input0, file$2, 31, 12, 727);
    			attr_dev(div0, "class", "inp-cont svelte-24a27w");
    			add_location(div0, file$2, 29, 8, 648);
    			attr_dev(span1, "class", "label");
    			add_location(span1, file$2, 34, 12, 844);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "grade svelte-24a27w");
    			add_location(input1, file$2, 35, 12, 888);
    			attr_dev(div1, "class", "inp-cont svelte-24a27w");
    			add_location(div1, file$2, 33, 8, 809);
    			attr_dev(span2, "class", "label");
    			add_location(span2, file$2, 38, 12, 1007);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "grade svelte-24a27w");
    			add_location(input2, file$2, 39, 12, 1055);
    			attr_dev(div2, "class", "inp-cont svelte-24a27w");
    			add_location(div2, file$2, 37, 8, 972);
    			attr_dev(span3, "class", "label");
    			add_location(span3, file$2, 42, 12, 1175);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "grade svelte-24a27w");
    			add_location(input3, file$2, 43, 12, 1221);
    			attr_dev(div3, "class", "inp-cont svelte-24a27w");
    			add_location(div3, file$2, 41, 8, 1140);
    			attr_dev(span4, "class", "label");
    			add_location(span4, file$2, 46, 12, 1340);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "grade svelte-24a27w");
    			add_location(input4, file$2, 47, 12, 1384);
    			attr_dev(div4, "class", "inp-cont svelte-24a27w");
    			add_location(div4, file$2, 45, 8, 1305);
    			attr_dev(span5, "class", "label");
    			add_location(span5, file$2, 50, 12, 1501);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "class", "grade svelte-24a27w");
    			add_location(input5, file$2, 51, 12, 1546);
    			attr_dev(div5, "class", "inp-cont svelte-24a27w");
    			add_location(div5, file$2, 49, 8, 1466);
    			attr_dev(span6, "class", "label");
    			add_location(span6, file$2, 54, 12, 1664);
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "class", "grade svelte-24a27w");
    			add_location(input6, file$2, 55, 12, 1707);
    			attr_dev(input7, "type", "submit");
    			input7.value = "submit";
    			set_style(input7, "opacity", "0");
    			set_style(input7, "width", "0");
    			attr_dev(input7, "class", "svelte-24a27w");
    			add_location(input7, file$2, 56, 12, 1777);
    			attr_dev(div6, "class", "inp-cont svelte-24a27w");
    			add_location(div6, file$2, 53, 8, 1629);
    			attr_dev(form, "class", "boxes blurW");
    			add_location(form, file$2, 28, 4, 581);
    			add_location(br, file$2, 59, 4, 1874);
    			add_location(section, file$2, 27, 0, 567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, form);
    			append_dev(form, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*show*/ ctx[1].type);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, span1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*show*/ ctx[1].record);
    			append_dev(form, t5);
    			append_dev(form, div2);
    			append_dev(div2, span2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			set_input_value(input2, /*show*/ ctx[1].release);
    			append_dev(form, t8);
    			append_dev(form, div3);
    			append_dev(div3, span3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			set_input_value(input3, /*show*/ ctx[1].source);
    			append_dev(form, t11);
    			append_dev(form, div4);
    			append_dev(div4, span4);
    			append_dev(div4, t13);
    			append_dev(div4, input4);
    			set_input_value(input4, /*show*/ ctx[1].size);
    			append_dev(form, t14);
    			append_dev(form, div5);
    			append_dev(div5, span5);
    			append_dev(div5, t16);
    			append_dev(div5, input5);
    			set_input_value(input5, /*show*/ ctx[1].stars);
    			append_dev(form, t17);
    			append_dev(form, div6);
    			append_dev(div6, span6);
    			append_dev(div6, t19);
    			append_dev(div6, input6);
    			set_input_value(input6, /*show*/ ctx[1].why);
    			append_dev(div6, t20);
    			append_dev(div6, input7);
    			append_dev(section, t21);
    			append_dev(section, br);
    			append_dev(section, t22);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[7]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[8]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[9]),
    					listen_dev(form, "submit", prevent_default(/*send*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*show*/ 2 && input0.value !== /*show*/ ctx[1].type) {
    				set_input_value(input0, /*show*/ ctx[1].type);
    			}

    			if (dirty & /*show*/ 2 && input1.value !== /*show*/ ctx[1].record) {
    				set_input_value(input1, /*show*/ ctx[1].record);
    			}

    			if (dirty & /*show*/ 2 && input2.value !== /*show*/ ctx[1].release) {
    				set_input_value(input2, /*show*/ ctx[1].release);
    			}

    			if (dirty & /*show*/ 2 && input3.value !== /*show*/ ctx[1].source) {
    				set_input_value(input3, /*show*/ ctx[1].source);
    			}

    			if (dirty & /*show*/ 2 && input4.value !== /*show*/ ctx[1].size) {
    				set_input_value(input4, /*show*/ ctx[1].size);
    			}

    			if (dirty & /*show*/ 2 && input5.value !== /*show*/ ctx[1].stars) {
    				set_input_value(input5, /*show*/ ctx[1].stars);
    			}

    			if (dirty & /*show*/ 2 && input6.value !== /*show*/ ctx[1].why) {
    				set_input_value(input6, /*show*/ ctx[1].why);
    			}

    			if (dirty & /*set, sourcer*/ 1) {
    				each_value = /*set*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    	validate_slots("Track", slots, []);
    	let { set } = $$props;

    	const send = () => {
    		const t = show;
    		$$invalidate(0, set = [t, ...set]);

    		fetch("/json/track", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify(show)
    		});
    	};

    	let show = {
    		type: "Movie",
    		record: "Don't Fuck with Cats",
    		release: "2019",
    		source: "Netflix",
    		stars: "",
    		size: "",
    		why: "8"
    	};

    	const writable_props = ["set"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Track> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		show.type = this.value;
    		$$invalidate(1, show);
    	}

    	function input1_input_handler() {
    		show.record = this.value;
    		$$invalidate(1, show);
    	}

    	function input2_input_handler() {
    		show.release = this.value;
    		$$invalidate(1, show);
    	}

    	function input3_input_handler() {
    		show.source = this.value;
    		$$invalidate(1, show);
    	}

    	function input4_input_handler() {
    		show.size = this.value;
    		$$invalidate(1, show);
    	}

    	function input5_input_handler() {
    		show.stars = this.value;
    		$$invalidate(1, show);
    	}

    	function input6_input_handler() {
    		show.why = this.value;
    		$$invalidate(1, show);
    	}

    	$$self.$$set = $$props => {
    		if ("set" in $$props) $$invalidate(0, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({ set, sourcer, send, show });

    	$$self.$inject_state = $$props => {
    		if ("set" in $$props) $$invalidate(0, set = $$props.set);
    		if ("show" in $$props) $$invalidate(1, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		set,
    		show,
    		send,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler
    	];
    }

    class Track extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { set: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Track",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*set*/ ctx[0] === undefined && !("set" in props)) {
    			console.warn("<Track> was created without expected prop 'set'");
    		}
    	}

    	get set() {
    		throw new Error("<Track>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Track>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* json/App.svelte generated by Svelte v3.29.0 */
    const file$3 = "json/App.svelte";

    // (40:4) {:else}
    function create_else_block(ctx) {
    	let tracker;
    	let current;

    	tracker = new Track({
    			props: {
    				set: /*trk*/ ctx[2],
    				state: /*search*/ ctx[4].toLowerCase()
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tracker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tracker, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tracker_changes = {};
    			if (dirty & /*trk*/ 4) tracker_changes.set = /*trk*/ ctx[2];
    			if (dirty & /*search*/ 16) tracker_changes.state = /*search*/ ctx[4].toLowerCase();
    			tracker.$set(tracker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tracker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tracker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tracker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(40:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:27) 
    function create_if_block_1(ctx) {
    	let multi;
    	let current;

    	multi = new Multiple({
    			props: {
    				set: /*mlt*/ ctx[0],
    				state: /*search*/ ctx[4].toLowerCase()
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(multi.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(multi, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const multi_changes = {};
    			if (dirty & /*mlt*/ 1) multi_changes.set = /*mlt*/ ctx[0];
    			if (dirty & /*search*/ 16) multi_changes.state = /*search*/ ctx[4].toLowerCase();
    			multi.$set(multi_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multi.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multi.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(multi, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(38:27) ",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if display == 0}
    function create_if_block(ctx) {
    	let single;
    	let current;

    	single = new Single({
    			props: {
    				set: /*sng*/ ctx[1],
    				state: /*search*/ ctx[4].toLowerCase()
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(single.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(single, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const single_changes = {};
    			if (dirty & /*sng*/ 2) single_changes.set = /*sng*/ ctx[1];
    			if (dirty & /*search*/ 16) single_changes.state = /*search*/ ctx[4].toLowerCase();
    			single.$set(single_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(single.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(single.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(single, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(36:4) {#if display == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section0;
    	let nav;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div1;
    	let t2;
    	let div1_class_value;
    	let t3;
    	let div2;
    	let t4;
    	let div2_class_value;
    	let t5;
    	let current_block_type_index;
    	let if_block;
    	let t6;
    	let section1;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*display*/ ctx[3] == 0) return 0;
    		if (/*display*/ ctx[3] == 1) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			nav = element("nav");
    			div0 = element("div");
    			t0 = text("Movies");
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Shows");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("Tracker");
    			t5 = space();
    			if_block.c();
    			t6 = space();
    			section1 = element("section");
    			input = element("input");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*display*/ ctx[3] == 0 ? "blurW" : "") + " svelte-qkmy8e"));
    			add_location(div0, file$3, 25, 8, 618);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*display*/ ctx[3] == 1 ? "blurW" : "") + " svelte-qkmy8e"));
    			add_location(div1, file$3, 28, 8, 733);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*display*/ ctx[3] == 2 ? "blurW" : "") + " svelte-qkmy8e"));
    			add_location(div2, file$3, 31, 8, 847);
    			attr_dev(nav, "class", "blurW svelte-qkmy8e");
    			add_location(nav, file$3, 24, 4, 590);
    			attr_dev(section0, "class", "svelte-qkmy8e");
    			add_location(section0, file$3, 23, 0, 576);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "engine blurW svelte-qkmy8e");
    			attr_dev(input, "placeholder", "Search");
    			add_location(input, file$3, 44, 4, 1253);
    			attr_dev(section1, "class", "filter svelte-qkmy8e");
    			add_location(section1, file$3, 43, 0, 1224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, nav);
    			append_dev(nav, div0);
    			append_dev(div0, t0);
    			append_dev(nav, t1);
    			append_dev(nav, div1);
    			append_dev(div1, t2);
    			append_dev(nav, t3);
    			append_dev(nav, div2);
    			append_dev(div2, t4);
    			append_dev(section0, t5);
    			if_blocks[current_block_type_index].m(section0, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, input);
    			set_input_value(input, /*search*/ ctx[4]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[6], false, false, false),
    					listen_dev(div2, "click", /*click_handler_2*/ ctx[7], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*display*/ 8 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*display*/ ctx[3] == 0 ? "blurW" : "") + " svelte-qkmy8e"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*display*/ 8 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*display*/ ctx[3] == 1 ? "blurW" : "") + " svelte-qkmy8e"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*display*/ 8 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*display*/ ctx[3] == 2 ? "blurW" : "") + " svelte-qkmy8e"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(section0, null);
    			}

    			if (dirty & /*search*/ 16 && input.value !== /*search*/ ctx[4]) {
    				set_input_value(input, /*search*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(section1);
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
    	validate_slots("App", slots, []);
    	let mlt = [], sng = [], trk = [], display = 1;
    	fetch("/data/multiple.json").then(res => res.json()).then(r => $$invalidate(0, mlt = r));
    	fetch("/data/single.json").then(res => res.json()).then(r => $$invalidate(1, sng = r));
    	fetch("/data/track.json").then(res => res.json()).then(r => $$invalidate(2, trk = r));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(3, display = 0);
    	const click_handler_1 = () => $$invalidate(3, display = 1);
    	const click_handler_2 = () => $$invalidate(3, display = 2);

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(4, search);
    	}

    	$$self.$capture_state = () => ({
    		mlt,
    		sng,
    		trk,
    		display,
    		Multi: Multiple,
    		Single,
    		Tracker: Track,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ("mlt" in $$props) $$invalidate(0, mlt = $$props.mlt);
    		if ("sng" in $$props) $$invalidate(1, sng = $$props.sng);
    		if ("trk" in $$props) $$invalidate(2, trk = $$props.trk);
    		if ("display" in $$props) $$invalidate(3, display = $$props.display);
    		if ("search" in $$props) $$invalidate(4, search = $$props.search);
    	};

    	let search;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(4, search = "");

    	return [
    		mlt,
    		sng,
    		trk,
    		display,
    		search,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App( { target: document.body } );

    return app;

}());
