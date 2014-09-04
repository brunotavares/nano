/*
  Copyright (C) 2014 Bruno Tavares <bruno@tavares.me>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*global env*/

(function(exports, opts) {
    'use strict';

    var allMembers,
        classes,
        encoding,
        fs,
        globalUrl,
        helper,
        hrefRegex,
        htmlsafe,
        indexUrl,
        linkto,
        logger,
        path,
        navItems,
        navItemsTutorials,
        outDir,
        searchData,
        sourceFiles,
        stripTagsRE,
        taffy,
        taffyData,
        template,
        templateCfg,
        templateDir,
        templateEngine,
        trimRegex,
        tutorials,
        util;


    // Imports
    // ---------

    fs = require('jsdoc/fs');
    helper = require('jsdoc/util/templateHelper');
    logger = require('jsdoc/util/logger');
    path = require('jsdoc/path');
    taffy = require('taffydb').taffy;
    util = require('util');
    templateEngine = require('jsdoc/template');
    linkto = helper.linkto;
    htmlsafe = helper.htmlsafe;

    encoding = opts.encoding || 'utf8';
    outDir = opts.destination;
    templateDir = opts.template;

    templateCfg = env.conf.templates || {};
    templateCfg.default = templateCfg.default || {};


    // Helpers
    // -------

    function find(spec) {
        return helper.find(taffyData, spec);
    }

    function hashToLink(doclet, hash) {
        if (!/^(#.+)/.test(hash)) {
            return hash;
        }

        var url = helper.createLink(doclet);

        url = url.replace(/(#.+|$)/, hash);
        return '<a href="' + url + '">' + hash + '</a>';
    }

    function tutoriallink(tutorial) {
        return helper.toTutorial(tutorial, null, { tag: 'em', classname: 'disabled', prefix: 'Tutorial: ' });
    }

    function stripHtml(str) {
        stripTagsRE = stripTagsRE||/<\/?[^>]+>/gi;
        return !str ? str : String(str).replace(stripTagsRE, "");
    }

    function extractHref(linkHtmlTag) {
        var matches;

        hrefRegex = hrefRegex||/href="([^"]+)"/;
        matches = linkHtmlTag.match(hrefRegex);

        if (matches && matches[1]) {
            return matches[1];
        }

        console.warn('Could not find href for :' + linkHtmlTag);
        return '';
    }

    function normalizeShortDescription(str) {
        str = resolveLinks(str);
        str = stripHtml(str);

        return str.length >= 120 ? str.substr(0, 117) + '...' : str;
    }

    function trim(s) {
        trimRegex = trimRegex||/^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
        return s.replace(trimRegex, '');
    }


    // Doclet Linking
    // --------------

    function getDocletHashLink(doclet) {
        return '#' + extractHref(helper.linkto(doclet.longname));
    }

    function linktoblank() {
        var linkHtmlTag = helper.linkto.apply(helper, arguments);
        return linkHtmlTag.replace(/<a /g, '<a target="_blank" ');
    }

    function resolveLinks() {
        var string = helper.resolveLinks.apply(helper, arguments);
        return string.replace(/href="(http|https|file):\/\//g, 'target="_blank" href="$1://');
    }


    // Tutorials
    // ---------

    function addTutorialsToMainNavigation(navItemsTutorials) {
        if (tutorials.length) {
            navItemsTutorials.push({
                text: 'Tutorials',
                items: tutorials.map(function(tutorial) {
                    return {
                        type: 'tutorial',
                        text: tutorial.name,
                        href: helper.tutorialToUrl(tutorial.name)
                    };
                })
            });
        }
    }


    function generateTutorialFiles(tutorialsList) {
        tutorialsList.forEach(function(tutorial) {
            var html,
                filename = helper.tutorialToUrl(tutorial.name),
                tutorialPath = path.join(outDir, filename),
                children = tutorial.children;

            html = resolveLinks(
                template.render(
                    'tutorial.tmpl', {
                        header: tutorial.title,
                        content: tutorial.parse(),
                        children: children,
                        helper: helper
                    }
                )
            );

            html = 'callback(' + JSON.stringify({
                html: html
            }) + ');';

            fs.writeFileSync(tutorialPath, html, 'utf8');

            if (children) {
                generateTutorialFiles(children);
            }
        });
    }


    // Classes
    // -------

    function addClassesToMainNavigation(navItems, seen) {
        var namespaceMap = {},
            sortedMap = {},
            items = [];

        function resolveNamespace(namespaces, depth) {
            var parentNamespace;

            if (typeof depth === 'undefined') {
                depth = namespaces.length - 1;
            }

            if (depth !== 0) {
                parentNamespace = resolveNamespace(namespaces, depth - 1);
            }

            var namespaceName = namespaces[depth],
                namespaceObj = namespaceMap[namespaceName];

            if (!namespaceObj) {
                namespaceObj = namespaceMap[namespaceName] = {
                    text: namespaceName,
                    type: 'class-namespace',
                    items: []
                };

                if (parentNamespace) {
                    parentNamespace.items.push(namespaceObj);
                } else {
                    items.push(namespaceObj);
                }
            }

            return namespaceObj;
        }

        function sortItems(a, b) {

            // package before class
            if (a.type === 'class-namespace' && b.type === 'class') {
                return -1;
            }
            if (a.type === 'class' && b.type === 'class-namespace') {
                return 1;
            }

            // by name
            if (a.text > b.text) {
                return 1;
            }
            if (a.text < b.text) {
                return -1;
            }

            if (a.items && !sortedMap[a.text]) {
                sortedMap[a.text] = true;
                a.items = a.items.sort(sortItems);
            }

            return 0;
        }

        if (classes.length) {
            classes.forEach(function(cls) {
                var namespaces, target,
                    hasNamespace = cls.longname.indexOf('.') !== -1;

                if (seen[cls.longname]) {
                    return;
                }
                seen[cls.longname] = true;


                if (hasNamespace) {
                    namespaces = cls.longname.split('.');
                    namespaces.pop();
                    target = resolveNamespace(namespaces).items;
                } else {
                    target = items;
                }

                searchData.push({
                    id: cls.id,
                    text: cls.name,
                    longname: cls.longname,
                    href: getDocletHashLink(cls)
                });

                target.push({
                    text: cls.name,
                    type: 'class',
                    href: getDocletHashLink(cls),
                    data: cls
                });
            });

            items = items.sort(sortItems);

            navItems.push({
                text: 'Classes',
                items: items
            });
        }
    }


    // Main Navigation
    // ---------------

    function getMainNavigationItems() {
        var globalNav,
            seen = {},
            navItems = [],
            modules = allMembers.modules,
            externals = allMembers.externals,
            events = allMembers.events,
            namespaces = allMembers.namespaces,
            mixins = allMembers.mixins,
            globals = allMembers.globals;

        if (modules.length) {
            navItems.push({
                text: 'Modules',
                items: modules.reduce(function(items, m) {
                    if (!seen[m.longname]) {
                        searchData.push({
                            id: m.id,
                            text: m.name,
                            longname: m.longname,
                            href: getDocletHashLink(m)
                        });

                        items.push({
                            type: 'module',
                            text: m.name,
                            href: getDocletHashLink(m)
                        });
                    }

                    seen[m.longname] = true;
                    return items;
                }, [])
            });
        }

        if (externals.length) {
            navItems.push({
                text: 'Externals',
                items: externals.reduce(function(items, e) {
                    if (!seen[e.longname]) {
                        searchData.push({
                            id: e.id,
                            text: e.name,
                            longname: e.longname,
                            href: getDocletHashLink(e)
                        });

                        items.push({
                            type: 'external',
                            text: e.name.replace(/(^"|"$)/g, ''),
                            href: getDocletHashLink(e)
                        });
                    }

                    seen[e.longname] = true;
                    return items;
                }, [])
            });
        }

        addClassesToMainNavigation(navItems, seen);

        if (events.length) {
            navItems.push({
                text: 'Events',
                items: events.reduce(function(items, e) {
                    if (!seen[e.longname]) {
                        searchData.push({
                            id: e.id,
                            text: e.name,
                            longname: e.longname,
                            href: getDocletHashLink(e)
                        });

                        items.push({
                            type: 'event',
                            text: e.name,
                            href: getDocletHashLink(e)
                        });
                    }

                    seen[e.longname] = true;
                    return items;
                }, [])
            });
        }

        if (namespaces.length) {
            navItems.push({
                text: 'Namespaces',
                items: namespaces.reduce(function(items, n) {
                    if (!seen[n.longname]) {
                        searchData.push({
                            id: n.id,
                            text: n.name,
                            longname: n.longname,
                            href: getDocletHashLink(n)
                        });

                        items.push({
                            type: 'namespace',
                            text: n.name,
                            href: getDocletHashLink(n)
                        });
                    }

                    seen[n.longname] = true;
                    return items;
                }, [])
            });
        }

        if (mixins.length) {
            navItems.push({
                text: 'Mixins',
                items: mixins.reduce(function(items, m) {
                    if (!seen[m.longname]) {
                        searchData.push({
                            id: m.id,
                            text: m.name,
                            longname: m.longname,
                            href: getDocletHashLink(m)
                        });

                        items.push({
                            type: 'mixin',
                            text: m.name,
                            href: getDocletHashLink(m)
                        });
                    }

                    seen[m.longname] = true;
                    return items;
                }, [])
            });
        }

        addTutorialsToMainNavigation(navItemsTutorials);

        if (globals.length) {
            globalNav = globals.reduce(function(items, g) {
                if (g.kind !== 'typedef' && !seen[g.longname]) {
                    searchData.push({
                        id: g.id,
                        text: g.name,
                        longname: g.longname,
                        href: getDocletHashLink(g)
                    });

                    items.push({
                        type: 'global',
                        text: g.name,
                        href: getDocletHashLink(g)
                    });
                }
                seen[g.longname] = true;
                return items;
            }, []);

            if (!globalNav.length) {
                globalNav.push({
                    type: 'global',
                    text: 'global scope',
                    href: '#global'
                });
            }

            navItems.push({
                text: 'Global',
                items: globalNav
            });
        }

        return navItems;
    }


    // Files System
    // ------------

    function setupOutputDirectory() {
        var packageInfo = find({
            kind: 'package'
        });

        // allow package.json define the output directory
        if (packageInfo && packageInfo[0]) {
            packageInfo = packageInfo[0];

            if (packageInfo.name) {
                outDir = path.join(outDir, packageInfo.name);
            }

            if (packageInfo.version) {
                outDir = path.join(outDir, packageInfo.version);
            }
        }

        fs.mkPath(outDir);
    }

    function copyStaticFiles() {
        var staticFilePaths,
            staticFileFilter,
            staticFileScanner,
            fromDir = path.join(templateDir, 'static', 'dist'),
            staticFiles = fs.ls(fromDir, 5),
            templateDefaultCfg = templateCfg.default;

        staticFiles.forEach(function(fileName) {

            if (fileName.indexOf('bower_components') !== -1) {
                return;
            }

            var toDir = fs.toDir(fileName.replace(fromDir, outDir));
            fs.mkPath(toDir);
            fs.copyFileSync(fileName, toDir);
        });

        // user static files - https://github.com/jsdoc3/jsdoc/issues/393
        if (templateDefaultCfg.staticFiles) {
            staticFilePaths = templateDefaultCfg.staticFiles.paths || [];
            staticFileFilter = new(require('jsdoc/src/filter')).Filter(templateCfg['default'].staticFiles);
            staticFileScanner = new(require('jsdoc/src/scanner')).Scanner();

            staticFilePaths.forEach(function(filePath) {
                var extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter);

                extraStaticFiles.forEach(function(fileName) {
                    var sourcePath = fs.toDir(filePath);
                    var toDir = fs.toDir(fileName.replace(sourcePath, outDir));
                    fs.mkPath(toDir);
                    fs.copyFileSync(fileName, toDir);
                });
            });
        }
    }

    function generateView(fileName, templateFile, data, resolveLinksEnabled, jsonp) {
        var outpath = path.join(outDir, fileName),
            html = template.render(templateFile, data || {});

        if (resolveLinksEnabled !== false) {
            html = resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
        }

        if (jsonp) {
            html = 'callback(' + JSON.stringify({
                html: html
            }) + ');';
        }

        fs.writeFileSync(outpath, html, 'utf8');
    }

    function generateJSONPView(fileName, templateFile, data) {
        data = data||{};
        data.helper = helper;

        return generateView(fileName, templateFile, data, true, true);
    }

    function generateSourceFiles() {
        Object.keys(sourceFiles).forEach(function(file) {
            var source;

            // links are keyed to the shortened path in each doclet's `meta.shortpath` property
            var sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened);
            helper.registerLink(sourceFiles[file].shortened, sourceOutfile);

            try {
                source = {
                    kind: 'source',
                    code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, encoding))
                };
            } catch (e) {
                logger.error('Error while generating source file %s: %s', file, e.message);
            }

            generateView(sourceOutfile, 'source.tmpl', {
                code: source.code
            }, false);
        });
    }

    function generateGlobalView() {
        if (allMembers.globals.length) {
            generateJSONPView(globalUrl, 'container.tmpl', {
                docs: [{
                    kind: 'globalobj'
                }]
            });
        }
    }

    function generateIndexView() {
        var docs,
            packages = find({kind: 'package'});

        docs = packages
            .concat([{
                kind: 'mainpage',
                readme: opts.readme,
                longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page'
            }]);

        generateView(indexUrl, 'index.tmpl', {
            docs: docs,
            navigationItems: navItems,
            tutorials: navItemsTutorials
        }, false, false);
    }

    function generateMembersViews() {
        // set up the lists that we'll use to generate pages
        var classes = taffy(allMembers.classes),
            modules = taffy(allMembers.modules),
            namespaces = taffy(allMembers.namespaces),
            mixins = taffy(allMembers.mixins),
            externals = taffy(allMembers.externals);

        Object.keys(helper.longnameToUrl).forEach(function(longname) {
            var url = helper.longnameToUrl[longname],
                myClasses = helper.find(classes, {
                    longname: longname
                }),
                myModules = helper.find(modules, {
                    longname: longname
                }),
                myNamespaces = helper.find(namespaces, {
                    longname: longname
                }),
                myMixins = helper.find(mixins, {
                    longname: longname
                }),
                myExternals = helper.find(externals, {
                    longname: longname
                });

            if (myClasses.length) {
                generateJSONPView(url, 'container.tmpl', {
                    docs: myClasses
                });
            }

            if (myModules.length) {
                generateJSONPView(url, 'container.tmpl', {
                    docs: myModules
                });
            }

            if (myNamespaces.length) {
                generateJSONPView(url, 'container.tmpl', {
                    docs: myNamespaces
                });
            }

            if (myMixins.length) {
                generateJSONPView(url, 'container.tmpl', {
                    docs: myMixins
                });
            }

            if (myExternals.length) {
                generateJSONPView(url, 'container.tmpl', {
                    docs: myExternals
                });
            }
        });
    }

    function generateSearchIndexFile() {
        var itemsAdded = {},
            searchFilePath = path.join(outDir, 'search-data.js'),
            members;

        members = find({
            kind: ['member', 'function', 'constant', 'typedef'],
            memberof: { isUndefined: false }
        });

        members.forEach(function(doclet) {
            var href = getDocletHashLink(doclet);

            if (itemsAdded[href]) {
                return;
            }
            itemsAdded[href] = true;

            searchData.push({
                id: doclet.id,
                text: doclet.name,
                longname: doclet.longname,
                href: href
            });
        });


        fs.writeFileSync(searchFilePath, 'SEARCH_DATA='+ JSON.stringify(searchData), 'utf8');
    }


    // Doclets
    // -------

    /**
     * Look for classes or functions with the same name as modules (which indicates that the module
     * exports only that class or function), then attach the classes or functions to the `module`
     * property of the appropriate module doclets. The name of each class or function is also updated
     * for display purposes. This function mutates the original arrays.
     *
     * @private
     * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
     * check.
     * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
     */
    function attachModuleSymbols(doclets) {
        var symbols = {},
            modules = allMembers.modules;

        // build a lookup table
        doclets.forEach(function(symbol) {
            symbols[symbol.longname] = symbol;
        });

        return modules.map(function(module) {
            if (symbols[module.longname]) {
                module.module = symbols[module.longname];
                module.module.name = module.module.name.replace('module:', '(require("') + '"))';
            }
        });
    }

    function needsSignature(doclet) {
        var needsSig = false;

        // function and class definitions always get a signature
        if (doclet.kind === 'function' || doclet.kind === 'class') {
            needsSig = true;
        }
        // typedefs that contain functions get a signature, too
        else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names &&
            doclet.type.names.length) {
            for (var i = 0, l = doclet.type.names.length; i < l; i++) {
                if (doclet.type.names[i].toLowerCase() === 'function') {
                    needsSig = true;
                    break;
                }
            }
        }

        return needsSig;
    }

    function addSignatureParams(f) {
        var params = f.params ? addParamAttributes(f.params) : [];

        f.signature = util.format('%s(%s)', (f.signature || ''), params.join(', '));
    }

    function addSignatureReturns(f) {
        var attribs = [];
        var attribsString = '';
        var returnTypes = [];
        var returnTypesString = '';

        // jam all the return-type attributes into an array. this could create odd results (for example,
        // if there are both nullable and non-nullable return types), but let's assume that most people
        // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
        if (f.returns) {
            f.returns.forEach(function(item) {
                helper.getAttribs(item).forEach(function(attrib) {
                    if (attribs.indexOf(attrib) === -1) {
                        attribs.push(attrib);
                    }
                });
            });

            attribsString = buildAttribsString(attribs);
        }

        if (f.returns) {
            returnTypes = addNonParamAttributes(f.returns);
        }
        if (returnTypes.length) {
            returnTypesString = util.format(' &rarr; %s{%s}', attribsString, returnTypes.join('|'));
        }

        f.signature = '<span class="signature">' + (f.signature || '') + '</span>' +
            '<span class="type-signature">' + returnTypesString + '</span>';
    }

    function addSignatureTypes(f) {
        var types = f.type ? buildItemTypeStrings(f) : [];

        f.signature = (f.signature || '') + '<span class="type-signature">' +
            (types.length ? ' :' + types.join('|') : '') + '</span>';
    }

    function getSignatureAttributes(item) {
        var attributes = [];

        if (item.optional) {
            attributes.push('opt');
        }

        if (item.nullable === true) {
            attributes.push('nullable');
        } else if (item.nullable === false) {
            attributes.push('non-null');
        }

        return attributes;
    }

    function updateItemName(item) {
        var attributes = getSignatureAttributes(item);
        var itemName = item.name || '';

        if (item.variable) {
            itemName = '&hellip;' + itemName;
        }

        if (attributes && attributes.length) {
            itemName = util.format('%s<span class="signature-attributes">%s</span>', itemName,
                attributes.join(', '));
        }

        return itemName;
    }

    function addParamAttributes(params) {
        return params.filter(function(param) {
            return param.name && param.name.indexOf('.') === -1;
        }).map(updateItemName);
    }

    function buildItemTypeStrings(item) {
        var types = [];

        if (item.type && item.type.names) {
            item.type.names.forEach(function(name) {
                types.push(linkto(name, htmlsafe(name)));
            });
        }

        return types;
    }

    function buildAttribsString(attribs) {
        var attribsString = '';

        if (attribs && attribs.length) {
            attribsString = attribs
                .map(function(attr) {
                    return '<span class="label label-' + attr + '">' + attr.toUpperCase() + '</span>';
                })
                .join('&nbsp;');
        }

        return attribsString;
    }

    function addNonParamAttributes(items) {
        var types = [];

        items.forEach(function(item) {
            types = types.concat(buildItemTypeStrings(item));
        });

        return types;
    }

    function addAttribs(f) {
        var attribs = helper.getAttribs(f);
        var attribsString = buildAttribsString(attribs);

        f.attribs = util.format('<span class="type-signature">%s</span>', attribsString);
    }

    function getPathFromDoclet(doclet) {
        if (!doclet.meta) {
            return null;
        }

        return doclet.meta.path && doclet.meta.path !== 'null' ?
            path.join(doclet.meta.path, doclet.meta.filename) :
            doclet.meta.filename;
    }

    function loadData() {
        var sourceFilePaths = [];

        sourceFiles = {};

        taffyData = helper.prune(taffyData);
        taffyData.sort('longname, version, since');
        helper.addEventListeners(taffyData);

        allMembers = helper.getMembers(taffyData);
        classes = allMembers.classes;

        taffyData().each(function(doclet) {
            doclet.attribs = '';

            normalizeDocletExamples(doclet);
            normalizeDocletSee(doclet);
            extractDocletSourceFiles(doclet, sourceFilePaths);
        });

        if (sourceFilePaths.length) {
            sourceFiles = shortenSourceFilesPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
        }

        taffyData().each(function(doclet) {
            var url = helper.createLink(doclet);

            helper.registerLink(doclet.longname, url);

            // add a shortened version of the full path
            var docletPath;
            if (doclet.meta) {
                docletPath = getPathFromDoclet(doclet);
                docletPath = sourceFiles[docletPath].shortened;
                if (docletPath) {
                    doclet.meta.shortpath = docletPath;
                }
            }
        });

        taffyData().each(function(doclet) {
            var url = helper.longnameToUrl[doclet.longname];

            if (url.indexOf('#') > -1) {
                doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
            } else {
                doclet.id = doclet.name;
            }

            if (needsSignature(doclet)) {
                addSignatureParams(doclet);
                addSignatureReturns(doclet);
                addAttribs(doclet);
            }
        });


        // do this after the urls have all been generated
        taffyData().each(function(doclet) {
            doclet.ancestors = helper.getAncestorLinks(taffyData, doclet);

            if (doclet.kind === 'member') {
                addSignatureTypes(doclet);
                addAttribs(doclet);
            }

            if (doclet.kind === 'constant') {
                addSignatureTypes(doclet);
                addAttribs(doclet);
                doclet.kind = 'member';
            }
        });

        attachModuleSymbols(find({
            kind: ['class', 'function'],
            longname: {
                left: 'module:'
            }
        }));
    }

    function normalizeDocletExamples(doclet) {
        if (doclet.examples) {
            doclet.examples = doclet.examples.map(function(example) {
                var caption, code;

                if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
                    caption = RegExp.$1;
                    code = RegExp.$3;
                }

                return {
                    caption: caption || '',
                    code: code || example
                };
            });
        }
    }

    function normalizeDocletSee(doclet) {
        if (doclet.see) {
            doclet.see.forEach(function(seeItem, i) {
                doclet.see[i] = hashToLink(doclet, seeItem);
            });
        }
    }

    function extractDocletSourceFiles(doclet, sourceFilePaths) {
        var sourcePath;

        if (doclet.meta) {
            sourcePath = getPathFromDoclet(doclet);
            sourceFiles[sourcePath] = {
                resolved: sourcePath,
                shortened: null
            };

            if (sourceFilePaths.indexOf(sourcePath) === -1) {
                sourceFilePaths.push(sourcePath);
            }
        }
    }

    function shortenSourceFilesPaths(files, commonPrefix) {
        Object.keys(files).forEach(function(file) {
            files[file].shortened = files[file].resolved.replace(commonPrefix, '')
                // always use forward slashes
                .replace(/\\/g, '/');
        });

        return files;
    }


    // Publish
    // -------

    exports.publish = function(data, opts, tutorialData) {
        var outputSourceFiles = templateCfg['default'].outputSourceFiles !== false;

        // url setup
        globalUrl = helper.getUniqueFilename('global');
        indexUrl = helper.getUniqueFilename('index');
        helper.registerLink('global', globalUrl);

        // tutorials
        helper.setTutorials(tutorialData);
        tutorials = tutorialData.children || [];

        // data
        taffyData = data;
        loadData();
        navItemsTutorials = [];
        searchData = [];
        navItems = getMainNavigationItems();

        // static files
        setupOutputDirectory();
        copyStaticFiles();

        // template
        template = new templateEngine.Template(templateDir + '/tmpl/dist');
        template.navItems = navItems;
        template.find = find;
        template.linkto = linkto;
        template.linktoblank = linktoblank;
        template.longnameToUrl = helper.longnameToUrl;
        template.resolveAuthorLinks = helper.resolveAuthorLinks;
        template.tutoriallink = tutoriallink;
        template.trim = trim;
        template.htmlsafe = htmlsafe;
        template.outputSourceFiles = outputSourceFiles;
        template.normalizeShortDescription = normalizeShortDescription;

        if (outputSourceFiles) {
            generateSourceFiles();
        }

        generateTutorialFiles(tutorials);
        generateGlobalView();
        generateIndexView();
        generateMembersViews();
        generateSearchIndexFile();
    };

}(exports, env.opts));
