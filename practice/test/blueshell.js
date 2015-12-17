/*!
 * Name: blueshell.js
 * Author: John Newman
 * Date: 7-18-12
 * Version: 2.1
 * License: MIT
 * URL: https://github.com/jgnewman/blueshell
 * Description: A JS microlibrary for inheritance.  Geared more toward seamless integration with prototypes. Even works in IE.
 *
 * Version 2 contains:
 *   - No more BS joke :)
 *   - Less looping
 *   - "Infinitely" chainable prototypes that are super easy to make
 *   - A simpler, stricter interface
 *   - Prototypes accessible in EVERY JS environment including old versions of IE
 *   - The .hatch method has been renamed .create
 *
 * Usage:
 * Any time you create an object, do it with BlueShell.create:
 *
 *   var person = B.create({name: 'john', age: 28})
 *
 * If you ignore the previous rule, you will not get seamless prototypes that work
 * in a cross-browser capacity.
 *
 * Any time you want to extend an object, also do it with BlueShell.create:
 *
 *   var kid = B.create(parent, B.create({name: 'bill', eyes: 'brown'}))
 *
 * A second argument will contain mixins and overrides.
 *
 * Any time you want to create a new object bound to a prototype, do it with BlueShell.bindProto:
 *
 *   var parent = B.create({
 *       "getName" : function () {return this.name;}
 *       "getAge"  : function () {return this.age;}
 *   });
 *   var kid = B.bindProto(parent, B.create({name: 'john', age: 28}));
 *
 * Objects created with BlueShell.bindProto undergo the same special treatment as objects created
 * with BlueShell.create so they can be used in all the same ways, including as prototypes
 * for other new objects.
 *
 * All prototypes attached with BlueShell can be retrieved in any JS environment.  Each Object
 * created with BlueShell has access to a prototypal "getProto" function that returns its
 * prototype:
 *
 * myObject.getProto();
 * => {...whatever the prototype is...}
 */

(function (global) {
    "use strict";

    var
        idIncrementor = 999999;

    /*
     * Step 1: Generate a new date in milliseconds
     * Step 2: Add an incrementor
     * Step 3: Add 25 random chars
     * Philosophy: Generating the date means we only have to worry about ids converging when
     *             those ids are created during the same millisecond.  The incrementor ranges
     *             from 1000000 to 9999999 so there is virtually no way that this many ids will
     *             be created in the same millisecond.  But if somehow they are or if a bad JS
     *             implementation somehow calls the function twice at the exact same moment and
     *             glitches out on the incrementor, we rely on a random 25 character string.
     */
    function idgen() {
        var newStr = '',
            chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz",
            i;

        // Start with a timestamp in milliseconds
        //获取时间戳
        newStr += (new Date()).getTime();

        // Add 1 to the incrementor and add on the new number
        idIncrementor += 1;
        newStr += ("-" + idIncrementor + "-");

        // Reset the incrementor if it's getting too large
        if (idIncrementor === 9999999) {
            idIncrementor = 999999;
        }

        // Add on a random 25 char string
        for (i = 0; i < 25; i += 1) {
            newStr += chars[Math.floor(Math.random() * chars.length)];
        }

        // If there was a prefix, add it to the beginning and end
        return newStr;
    }

    /*
     * Where:
     * scope - an object literal intended to be populated
     * obj   - an object literal whose properties will be added to scope
     *
     * Adds properties from one object to another.
     */
    function construct(scope, obj) {
        var i;
        /*
         * Don't use code from the loops module here.  If we try this with any
         * technique other than a native for...in loop, data doesn't populate.
         */
        for (i in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, i)) {
                scope[i] = obj[i];
            }
        }
        return scope;
    }

    /*
     * Where:
     * parent    - an object literal; the parent to be cloned
     * child     - an object literal; mixin properties
     * copyProto - false or optional; useful to tell the function NOT to attach the
     *             prototype of the parent to the child
     *
     * Extends an object with mixin properties. If the parent has a custom prototype,
     * attaches the child to the same prototype unless otherwise specified.
     */

    // holds references to prototypes to make them cross-retrievable
    var protoRefs = {};

    function Class(parent, child, copyProto) {
        var Inherit = {},
            newId = idgen(),
            middleChild,
            middleBinding;
    //Class.inherit.ClassChain
        /*
         * This actually does the construction.
         * Call it Inherit.ClassChain for instance naming consistency.
         * It is defined within the Class function because its prototype
         * is subject to change depending on what the user is trying to do
         * thus we need to generate a new instance of this every time we call new Class().
         */
        Inherit.ClassChain = function (parent, child) {
            construct(this, parent);
            if (child) {
                return construct(this, child);
            }
            return this;
        };

        /*
         * If the parent was created with this module we want the child to inherit the parent's
         * prototype unless the user tells us not to.
         * However, if the parent's prototype is Object, we'll lose all our cool methods so
         * in that case we want to defer to the else case as well.
         */
        if (parent.getProto
            && parent.getProto() !== Object.prototype
            && parent.isClassChain
            && !Object.prototype.hasOwnProperty.call(parent, 'isClassChain')
            && copyProto !== false) {alert(111)

            /*
             * In order to make prototypes retrievable, we have to override the protoRef
             * property.  We do that by adding an object between the prototype and the child
             * that contains the override.
             */
            Inherit.ChainLink = function (newSpec) {
                construct(this, newSpec);
            };
            middleChild = {
                "protoRef": idgen()
            };

            // Create a reference to the prototype to make it retrievable.
            protoRefs[middleChild.protoRef] = parent.getProto();

            // Attach the prototype chain to the middle object and run the constructor.
            Inherit.ChainLink.prototype = parent.getProto();
            middleBinding = new Inherit.ChainLink(middleChild);

            // Lastly attach the expanded prototype to the constructor and build the new object.
            Inherit.ClassChain.prototype = middleBinding;
            return new Inherit.ClassChain(parent, child);
        }

        /*
         * In the case that we do not want the child to inherit the parent's prototype...
         * We generate the default prototype object, attach it to the constructor,
         * and build the new object.
         */
        Inherit.ClassChain.prototype = {
            "isClassChain": true,
            "protoRef": newId,

            /*
             * Return the object's prototype
             */
            "getProto": function () {
                var proto = protoRefs[this.protoRef];
                return (!proto) ? Object.prototype : proto;
            },

            /*
             * Add a create method to the prototype so we can
             * do things like myObject.create() to make a new instance.
             */
            "create": function (mixins, copyPrototype) {
                return new Class(this, mixins, copyPrototype);
            }
        };

        return new Inherit.ClassChain(parent, child);
    }


    /*
     * Where:
     * proto - an object literal; the object to be used as a prototype
     * child - an object literal; the object to be attached to the proto
     *
     * Attaches an object to a prototype
     */
    function Proto(proto, child) {
        var Inherit = {},
            middleChild,
            middleBinding;

        /*
         * This does the actual object building.
         * Just like in the Class function, we name it Inherit.ClassChain for instance naming consistency.
         * Also like in the Class function, it has to be generated anew upon every instance
         * of Proto being called because the prototype we attach to it is subject to change.
         */
        Inherit.ClassChain = function (newSpec) {
            construct(this, newSpec);
        };

        // If the prototypal parent was created with blueshell, we want to nest prototypes.
        if (proto.isClassChain && !Object.prototype.hasOwnProperty.call(proto, 'isClassChain')) {

            /*
             * In order to make prototypes retrievable, we have to override the protoRef
             * property.  We do that by adding an object between the prototype and the child
             * that contains the override.
             */
            Inherit.ChainLink = function (newSpec) {
                construct(this, newSpec);
            };
            middleChild = {
                "protoRef": idgen()
            };

            // Create a reference to the prototype to make it retrievable.
            protoRefs[middleChild.protoRef] = proto;

            // Attach the prototype to the middle object constructor and run it.
            Inherit.ChainLink.prototype = proto;
            middleBinding = new Inherit.ChainLink(middleChild);

            // Lastly, attach the middle object to the main constructor as a prototype and run it.
            Inherit.ClassChain.prototype = middleBinding;
            return new Inherit.ClassChain(child);
        }

        // If there is currently no prototype chain, begin one using proto as the original prototype.

        // Create a reference to the prototype to make it retrievable.
        protoRefs[child.protoRef] = proto;

        // Attach the prototype to the constructor and build the object.
        Inherit.ClassChain.prototype = proto;
        return new Inherit.ClassChain(child);
    }


    var exports = {};
    // Export module code
    exports = {

        /*
         * Where:
         * proto - an object literal; the object to be used as a prototype
         * child - an object literal; the object to be attached to the proto
         *
         * Attaches an object to a prototype
         */
        "bindProto": function (proto, child) {
            return new Proto(proto, child);
        },

        /*
         * Where:
         * parent    - an object literal; the parent to be cloned
         * child     - an object literal; mixin properties
         * copyProto - false or optional; useful to tell the function NOT to attach the
         *             prototype of the parent to the child
         *
         * Extends an object with mixin properties. If the parent has a custom prototype,
         * attaches the child to the same prototype unless otherwise specified.
         */
        "create": function (parent, child, copyProto) {
            return new Class(parent, child, copyProto);
        }
    };

    var module = module || null;
    // AMD
    if (global.define && typeof global.define === fun && global.define.amd) {
        global.define('BlueShell', [], exports);

        // Node
    } else if (module && module.exports) {
        module.exports = exports;

        // Browser
    } else {
        global.BlueShell = global.B = exports;
    }

}(this));





