(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("braft-convert-2"), require("braft-finder-2"), require("braft-utils-2"), require("draft-js"), require("draftjs-utils"), require("immutable"), require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["braft-convert-2", "braft-finder-2", "braft-utils-2", "draft-js", "draftjs-utils", "immutable", "react", "react-dom"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("braft-convert-2"), require("braft-finder-2"), require("braft-utils-2"), require("draft-js"), require("draftjs-utils"), require("immutable"), require("react"), require("react-dom")) : factory(root["braft-convert-2"], root["braft-finder-2"], root["braft-utils-2"], root["draft-js"], root["draftjs-utils"], root["immutable"], root["react"], root["react-dom"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, (__WEBPACK_EXTERNAL_MODULE__194__, __WEBPACK_EXTERNAL_MODULE__121__, __WEBPACK_EXTERNAL_MODULE__601__, __WEBPACK_EXTERNAL_MODULE__256__, __WEBPACK_EXTERNAL_MODULE__703__, __WEBPACK_EXTERNAL_MODULE__292__, __WEBPACK_EXTERNAL_MODULE__156__, __WEBPACK_EXTERNAL_MODULE__111__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 721:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Immutable = __webpack_require__(292);

var KEY_SEPARATOR = '-';

function MultiDecorator(decorators) {
    this.decorators = Immutable.List(decorators);
}

/**
    Return list of decoration IDs per character

    @param {ContentBlock}
    @return {List<String>}
*/
MultiDecorator.prototype.getDecorations = function(block, contentState) {
    var decorations = Array(block.getText().length).fill(null);

    this.decorators.forEach(function(decorator, i) {
        var _decorations = decorator.getDecorations(block, contentState);

        _decorations.forEach(function(key, offset) {
            if (!key) {
                return;
            }

            key = i + KEY_SEPARATOR + key;

            decorations[offset] = key;
        });
    });

    return Immutable.List(decorations);
};

/**
    Return component to render a decoration

    @param {String}
    @return {Function}
*/
MultiDecorator.prototype.getComponentForKey = function(key) {
    var decorator = this.getDecoratorForKey(key);
    return decorator.getComponentForKey(
        this.getInnerKey(key)
    );
};

/**
    Return props to render a decoration

    @param {String}
    @return {Object}
*/
MultiDecorator.prototype.getPropsForKey = function(key) {
    var decorator = this.getDecoratorForKey(key);
    return decorator.getPropsForKey(
        this.getInnerKey(key)
    );
};

/**
    Return a decorator for a specific key

    @param {String}
    @return {Decorator}
*/
MultiDecorator.prototype.getDecoratorForKey = function(key) {
    var parts = key.split(KEY_SEPARATOR);
    var index = Number(parts[0]);

    return this.decorators.get(index);
};

/**
    Return inner key for a decorator

    @param {String}
    @return {String}
*/
MultiDecorator.prototype.getInnerKey = function(key) {
    var parts = key.split(KEY_SEPARATOR);
    return parts.slice(1).join(KEY_SEPARATOR);
};

module.exports = MultiDecorator;


/***/ }),

/***/ 490:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = __webpack_require__(292),
    Map = _require.Map,
    OrderedSet = _require.OrderedSet,
    Record = _require.Record; // Immutable.map is typed such that the value for every key in the map
// must be the same type


var EMPTY_SET = OrderedSet();
var defaultRecord = {
  style: EMPTY_SET,
  entity: null
};
var CharacterMetadataRecord = Record(defaultRecord);

var CharacterMetadata = /*#__PURE__*/function (_CharacterMetadataRec) {
  _inheritsLoose(CharacterMetadata, _CharacterMetadataRec);

  function CharacterMetadata() {
    return _CharacterMetadataRec.apply(this, arguments) || this;
  }

  var _proto = CharacterMetadata.prototype;

  _proto.getStyle = function getStyle() {
    return this.get('style');
  };

  _proto.getEntity = function getEntity() {
    return this.get('entity');
  };

  _proto.hasStyle = function hasStyle(style) {
    return this.getStyle().includes(style);
  };

  CharacterMetadata.applyStyle = function applyStyle(record, style) {
    var withStyle = record.set('style', record.getStyle().add(style));
    return CharacterMetadata.create(withStyle);
  };

  CharacterMetadata.removeStyle = function removeStyle(record, style) {
    var withoutStyle = record.set('style', record.getStyle().remove(style));
    return CharacterMetadata.create(withoutStyle);
  };

  CharacterMetadata.applyEntity = function applyEntity(record, entityKey) {
    var withEntity = record.getEntity() === entityKey ? record : record.set('entity', entityKey);
    return CharacterMetadata.create(withEntity);
  }
  /**
   * Use this function instead of the `CharacterMetadata` constructor.
   * Since most content generally uses only a very small number of
   * style/entity permutations, we can reuse these objects as often as
   * possible.
   */
  ;

  CharacterMetadata.create = function create(config) {
    if (!config) {
      return EMPTY;
    }

    var defaultConfig = {
      style: EMPTY_SET,
      entity: null
    }; // Fill in unspecified properties, if necessary.

    var configMap = Map(defaultConfig).merge(config);
    var existing = pool.get(configMap);

    if (existing) {
      return existing;
    }

    var newCharacter = new CharacterMetadata(configMap);
    pool = pool.set(configMap, newCharacter);
    return newCharacter;
  };

  CharacterMetadata.fromJS = function fromJS(_ref) {
    var style = _ref.style,
        entity = _ref.entity;
    return new CharacterMetadata({
      style: Array.isArray(style) ? OrderedSet(style) : style,
      entity: Array.isArray(entity) ? OrderedSet(entity) : entity
    });
  };

  return CharacterMetadata;
}(CharacterMetadataRecord);

var EMPTY = new CharacterMetadata();
var pool = Map([[Map(defaultRecord), EMPTY]]);
CharacterMetadata.EMPTY = EMPTY;
module.exports = CharacterMetadata;

/***/ }),

/***/ 207:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 *
 * This file is a fork of ContentBlock adding support for nesting references by
 * providing links to children, parent, prevSibling, and nextSibling.
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CharacterMetadata = __webpack_require__(490);

var findRangesImmutable = __webpack_require__(572);

var Immutable = __webpack_require__(292);

var List = Immutable.List,
    Map = Immutable.Map,
    OrderedSet = Immutable.OrderedSet,
    Record = Immutable.Record,
    Repeat = Immutable.Repeat;
var EMPTY_SET = OrderedSet();
var defaultRecord = {
  parent: null,
  characterList: List(),
  data: Map(),
  depth: 0,
  key: '',
  text: '',
  type: 'unstyled',
  children: List(),
  prevSibling: null,
  nextSibling: null
};

var haveEqualStyle = function haveEqualStyle(charA, charB) {
  return charA.getStyle() === charB.getStyle();
};

var haveEqualEntity = function haveEqualEntity(charA, charB) {
  return charA.getEntity() === charB.getEntity();
};

var decorateCharacterList = function decorateCharacterList(config) {
  if (!config) {
    return config;
  }

  var characterList = config.characterList,
      text = config.text;

  if (text && !characterList) {
    config.characterList = List(Repeat(CharacterMetadata.EMPTY, text.length));
  }

  return config;
};

var ContentBlockNode = /*#__PURE__*/function (_ref) {
  _inheritsLoose(ContentBlockNode, _ref);

  function ContentBlockNode() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRecord;

    /* eslint-disable-next-line constructor-super */
    return _ref.call(this, decorateCharacterList(props)) || this;
  }

  var _proto = ContentBlockNode.prototype;

  _proto.getKey = function getKey() {
    return this.get('key');
  };

  _proto.getType = function getType() {
    return this.get('type');
  };

  _proto.getText = function getText() {
    return this.get('text');
  };

  _proto.getCharacterList = function getCharacterList() {
    return this.get('characterList');
  };

  _proto.getLength = function getLength() {
    return this.getText().length;
  };

  _proto.getDepth = function getDepth() {
    return this.get('depth');
  };

  _proto.getData = function getData() {
    return this.get('data');
  };

  _proto.getInlineStyleAt = function getInlineStyleAt(offset) {
    var character = this.getCharacterList().get(offset);
    return character ? character.getStyle() : EMPTY_SET;
  };

  _proto.getEntityAt = function getEntityAt(offset) {
    var character = this.getCharacterList().get(offset);
    return character ? character.getEntity() : null;
  };

  _proto.getChildKeys = function getChildKeys() {
    return this.get('children');
  };

  _proto.getParentKey = function getParentKey() {
    return this.get('parent');
  };

  _proto.getPrevSiblingKey = function getPrevSiblingKey() {
    return this.get('prevSibling');
  };

  _proto.getNextSiblingKey = function getNextSiblingKey() {
    return this.get('nextSibling');
  };

  _proto.findStyleRanges = function findStyleRanges(filterFn, callback) {
    findRangesImmutable(this.getCharacterList(), haveEqualStyle, filterFn, callback);
  };

  _proto.findEntityRanges = function findEntityRanges(filterFn, callback) {
    findRangesImmutable(this.getCharacterList(), haveEqualEntity, filterFn, callback);
  };

  return ContentBlockNode;
}(Record(defaultRecord));

module.exports = ContentBlockNode;

/***/ }),

/***/ 572:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


/**
 * Search through an array to find contiguous stretches of elements that
 * match a specified filter function.
 *
 * When ranges are found, execute a specified `found` function to supply
 * the values to the caller.
 */
function findRangesImmutable(haystack, areEqualFn, filterFn, foundFn) {
  if (!haystack.size) {
    return;
  }

  var cursor = 0;
  haystack.reduce(function (value, nextValue, nextIndex) {
    if (!areEqualFn(value, nextValue)) {
      if (filterFn(value)) {
        foundFn(cursor, nextIndex);
      }

      cursor = nextIndex;
    }

    return nextValue;
  });
  filterFn(haystack.last()) && foundFn(cursor, haystack.count());
}

module.exports = findRangesImmutable;

/***/ }),

/***/ 462:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var seenKeys = {};
var MULTIPLIER = Math.pow(2, 24);

function generateRandomKey() {
  var key;

  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }

  seenKeys[key] = true;
  return key;
}

module.exports = generateRandomKey;

/***/ }),

/***/ 845:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var randomizeBlockMapKeys = __webpack_require__(290);

var removeEntitiesAtEdges = __webpack_require__(511);

var getContentStateFragment = function getContentStateFragment(contentState, selectionState) {
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset(); // Edge entities should be stripped to ensure that we don't preserve
  // invalid partial entities when the fragment is reused. We do, however,
  // preserve entities that are entirely within the selection range.

  var contentWithoutEdgeEntities = removeEntitiesAtEdges(contentState, selectionState);
  var blockMap = contentWithoutEdgeEntities.getBlockMap();
  var blockKeys = blockMap.keySeq();
  var startIndex = blockKeys.indexOf(startKey);
  var endIndex = blockKeys.indexOf(endKey) + 1;
  return randomizeBlockMapKeys(blockMap.slice(startIndex, endIndex).map(function (block, blockKey) {
    var text = block.getText();
    var chars = block.getCharacterList();

    if (startKey === endKey) {
      return block.merge({
        text: text.slice(startOffset, endOffset),
        characterList: chars.slice(startOffset, endOffset)
      });
    }

    if (blockKey === startKey) {
      return block.merge({
        text: text.slice(startOffset),
        characterList: chars.slice(startOffset)
      });
    }

    if (blockKey === endKey) {
      return block.merge({
        text: text.slice(0, endOffset),
        characterList: chars.slice(0, endOffset)
      });
    }

    return block;
  }));
};

module.exports = getContentStateFragment;

/***/ }),

/***/ 295:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var getContentStateFragment = __webpack_require__(845);

function getFragmentFromSelection(editorState) {
  var selectionState = editorState.getSelection();

  if (selectionState.isCollapsed()) {
    return null;
  }

  return getContentStateFragment(editorState.getCurrentContent(), selectionState);
}

module.exports = getFragmentFromSelection;

/***/ }),

/***/ 290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var ContentBlockNode = __webpack_require__(207);

var generateRandomKey = __webpack_require__(462);

var Immutable = __webpack_require__(292);

var OrderedMap = Immutable.OrderedMap;

var randomizeContentBlockNodeKeys = function randomizeContentBlockNodeKeys(blockMap) {
  var newKeysRef = {}; // we keep track of root blocks in order to update subsequent sibling links

  var lastRootBlock;
  return OrderedMap(blockMap.withMutations(function (blockMapState) {
    blockMapState.forEach(function (block, index) {
      var oldKey = block.getKey();
      var nextKey = block.getNextSiblingKey();
      var prevKey = block.getPrevSiblingKey();
      var childrenKeys = block.getChildKeys();
      var parentKey = block.getParentKey(); // new key that we will use to build linking

      var key = generateRandomKey(); // we will add it here to re-use it later

      newKeysRef[oldKey] = key;

      if (nextKey) {
        var nextBlock = blockMapState.get(nextKey);

        if (nextBlock) {
          blockMapState.setIn([nextKey, 'prevSibling'], key);
        } else {
          // this can happen when generating random keys for fragments
          blockMapState.setIn([oldKey, 'nextSibling'], null);
        }
      }

      if (prevKey) {
        var prevBlock = blockMapState.get(prevKey);

        if (prevBlock) {
          blockMapState.setIn([prevKey, 'nextSibling'], key);
        } else {
          // this can happen when generating random keys for fragments
          blockMapState.setIn([oldKey, 'prevSibling'], null);
        }
      }

      if (parentKey && blockMapState.get(parentKey)) {
        var parentBlock = blockMapState.get(parentKey);
        var parentChildrenList = parentBlock.getChildKeys();
        blockMapState.setIn([parentKey, 'children'], parentChildrenList.set(parentChildrenList.indexOf(block.getKey()), key));
      } else {
        // blocks will then be treated as root block nodes
        blockMapState.setIn([oldKey, 'parent'], null);

        if (lastRootBlock) {
          blockMapState.setIn([lastRootBlock.getKey(), 'nextSibling'], key);
          blockMapState.setIn([oldKey, 'prevSibling'], newKeysRef[lastRootBlock.getKey()]);
        }

        lastRootBlock = blockMapState.get(oldKey);
      }

      childrenKeys.forEach(function (childKey) {
        var childBlock = blockMapState.get(childKey);

        if (childBlock) {
          blockMapState.setIn([childKey, 'parent'], key);
        } else {
          blockMapState.setIn([oldKey, 'children'], block.getChildKeys().filter(function (child) {
            return child !== childKey;
          }));
        }
      });
    });
  }).toArray().map(function (block) {
    return [newKeysRef[block.getKey()], block.set('key', newKeysRef[block.getKey()])];
  }));
};

var randomizeContentBlockKeys = function randomizeContentBlockKeys(blockMap) {
  return OrderedMap(blockMap.toArray().map(function (block) {
    var key = generateRandomKey();
    return [key, block.set('key', key)];
  }));
};

var randomizeBlockMapKeys = function randomizeBlockMapKeys(blockMap) {
  var isTreeBasedBlockMap = blockMap.first() instanceof ContentBlockNode;

  if (!isTreeBasedBlockMap) {
    return randomizeContentBlockKeys(blockMap);
  }

  return randomizeContentBlockNodeKeys(blockMap);
};

module.exports = randomizeBlockMapKeys;

/***/ }),

/***/ 511:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */


var CharacterMetadata = __webpack_require__(490);

var findRangesImmutable = __webpack_require__(572);

var invariant = __webpack_require__(81);

function removeEntitiesAtEdges(contentState, selectionState) {
  var blockMap = contentState.getBlockMap();
  var entityMap = contentState.getEntityMap();
  var updatedBlocks = {};
  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var startBlock = blockMap.get(startKey);
  var updatedStart = removeForBlock(entityMap, startBlock, startOffset);

  if (updatedStart !== startBlock) {
    updatedBlocks[startKey] = updatedStart;
  }

  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();
  var endBlock = blockMap.get(endKey);

  if (startKey === endKey) {
    endBlock = updatedStart;
  }

  var updatedEnd = removeForBlock(entityMap, endBlock, endOffset);

  if (updatedEnd !== endBlock) {
    updatedBlocks[endKey] = updatedEnd;
  }

  if (!Object.keys(updatedBlocks).length) {
    return contentState.set('selectionAfter', selectionState);
  }

  return contentState.merge({
    blockMap: blockMap.merge(updatedBlocks),
    selectionAfter: selectionState
  });
}
/**
 * Given a list of characters and an offset that is in the middle of an entity,
 * returns the start and end of the entity that is overlapping the offset.
 * Note: This method requires that the offset be in an entity range.
 */


function getRemovalRange(characters, entityKey, offset) {
  var removalRange; // Iterates through a list looking for ranges of matching items
  // based on the 'isEqual' callback.
  // Then instead of returning the result, call the 'found' callback
  // with each range.
  // Then filters those ranges based on the 'filter' callback
  //
  // Here we use it to find ranges of characters with the same entity key.

  findRangesImmutable(characters, // the list to iterate through
  function (a, b) {
    return a.getEntity() === b.getEntity();
  }, // 'isEqual' callback
  function (element) {
    return element.getEntity() === entityKey;
  }, // 'filter' callback
  function (start, end) {
    // 'found' callback
    if (start <= offset && end >= offset) {
      // this entity overlaps the offset index
      removalRange = {
        start: start,
        end: end
      };
    }
  });
  !(typeof removalRange === 'object') ?  false ? 0 : invariant(false) : void 0;
  return removalRange;
}

function removeForBlock(entityMap, block, offset) {
  var chars = block.getCharacterList();
  var charBefore = offset > 0 ? chars.get(offset - 1) : undefined;
  var charAfter = offset < chars.count() ? chars.get(offset) : undefined;
  var entityBeforeCursor = charBefore ? charBefore.getEntity() : undefined;
  var entityAfterCursor = charAfter ? charAfter.getEntity() : undefined;

  if (entityAfterCursor && entityAfterCursor === entityBeforeCursor) {
    var entity = entityMap.__get(entityAfterCursor);

    if (entity.getMutability() !== 'MUTABLE') {
      var _getRemovalRange = getRemovalRange(chars, entityAfterCursor, offset),
          start = _getRemovalRange.start,
          end = _getRemovalRange.end;

      var current;

      while (start < end) {
        current = chars.get(start);
        chars = chars.set(start, CharacterMetadata.applyEntity(current, null));
        start++;
      }

      return block.set('characterList', chars);
    }
  }

  return block;
}

module.exports = removeEntitiesAtEdges;

/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


var validateFormat =  false ? 0 : function (format) {};
/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments to provide
 * information about what broke and what you were expecting.
 *
 * The invariant message will be stripped in production, but the invariant will
 * remain to ensure logic does not differ in production.
 */

function invariant(condition, format) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  validateFormat(format);

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return String(args[argIndex++]);
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // Skip invariant's own stack frame.

    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ 772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(331);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(772)();
}


/***/ }),

/***/ 331:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 194:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__194__;

/***/ }),

/***/ 121:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__121__;

/***/ }),

/***/ 601:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__601__;

/***/ }),

/***/ 256:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__256__;

/***/ }),

/***/ 703:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__703__;

/***/ }),

/***/ 292:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__292__;

/***/ }),

/***/ 156:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__156__;

/***/ }),

/***/ 111:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__111__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  EditorState: () => (/* reexport */ external_draft_js_.EditorState),
  "default": () => (/* binding */ index),
  getDecorators: () => (/* reexport */ getDecorators)
});

;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
// EXTERNAL MODULE: external "braft-convert-2"
var external_braft_convert_2_ = __webpack_require__(194);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(156);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: ./helpers/extension.jsx

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/* eslint-disable no-param-reassign */
// TODO
// -extended support for block-style and atomic types


var extensionControls = [];
var extensionDecorators = [];
var propInterceptors = [];
var extensionBlockRenderMaps = [];
var extensionBlockRendererFns = [];
var extensionInlineStyleMaps = [];
var extensionInlineStyleFns = [];
var extensionEntities = [];
var inlineStyleImporters = [];
var inlineStyleExporters = [];
var blockImporters = [];
var blockExporters = [];
var filterByEditorId = function filterByEditorId(items, editorId) {
  if (!editorId) {
    return items.filter(function (item) {
      return !item.includeEditors;
    }).map(function (item) {
      return item.data;
    });
  }
  return items.map(function (item) {
    if (!item.includeEditors && !item.excludeEditors) {
      return item.data;
    }
    if (item.includeEditors) {
      return item.includeEditors.indexOf(editorId) !== -1 ? item.data : false;
    }
    if (item.excludeEditors) {
      return item.excludeEditors.indexOf(editorId) !== -1 ? false : item.data;
    }
    return false;
  }).filter(function (item) {
    return item;
  });
};
var getPropInterceptors = function getPropInterceptors(editorId) {
  return filterByEditorId(propInterceptors, editorId);
};
var getExtensionControls = function getExtensionControls(editorId) {
  return filterByEditorId(extensionControls, editorId);
};
var getExtensionDecorators = function getExtensionDecorators(editorId) {
  return filterByEditorId(extensionDecorators, editorId, 'decorators');
};
var getExtensionBlockRenderMaps = function getExtensionBlockRenderMaps(editorId) {
  return filterByEditorId(extensionBlockRenderMaps, editorId);
};
var getExtensionBlockRendererFns = function getExtensionBlockRendererFns(editorId) {
  return filterByEditorId(extensionBlockRendererFns, editorId);
};
var getExtensionInlineStyleMap = function getExtensionInlineStyleMap(editorId) {
  var inlineStyleMap = {};
  filterByEditorId(extensionInlineStyleMaps, editorId).forEach(function (item) {
    inlineStyleMap[item.inlineStyleName] = item.styleMap;
  });
  return inlineStyleMap;
};
var getExtensionInlineStyleFns = function getExtensionInlineStyleFns(editorId) {
  return filterByEditorId(extensionInlineStyleFns, editorId);
};
var compositeStyleImportFn = function compositeStyleImportFn(styleImportFn, editorId) {
  return function (nodeName, node, style) {
    filterByEditorId(inlineStyleImporters, editorId).forEach(function (styleImporter) {
      if (styleImporter.importer && styleImporter.importer(nodeName, node)) {
        style = style.add(styleImporter.inlineStyleName);
      }
    });
    return styleImportFn ? styleImportFn(nodeName, node, style) : style;
  };
};
var compositeStyleExportFn = function compositeStyleExportFn(styleExportFn, editorId) {
  return function (style) {
    style = style.toUpperCase();
    var result = styleExportFn ? styleExportFn(style) : undefined;
    if (result) {
      return result;
    }
    filterByEditorId(inlineStyleExporters, editorId).find(function (item) {
      if (item.inlineStyleName === style) {
        result = item.exporter;
        return true;
      }
      return false;
    });
    return result;
  };
};
var compositeEntityImportFn = function compositeEntityImportFn(entityImportFn, editorId) {
  return function (nodeName, node, createEntity, source) {
    var result = entityImportFn ? entityImportFn(nodeName, node, createEntity, source) : null;
    if (result) {
      return result;
    }
    filterByEditorId(extensionEntities, editorId).find(function (entityItem) {
      var matched = entityItem.importer ? entityItem.importer(nodeName, node, source) : null;
      if (matched) {
        result = createEntity(entityItem.entityType, matched.mutability || 'MUTABLE', matched.data || {});
      }
      return !!matched;
    });
    return result;
  };
};
var compositeEntityExportFn = function compositeEntityExportFn(entityExportFn, editorId) {
  return function (entity, originalText) {
    var result = entityExportFn ? entityExportFn(entity, originalText) : undefined;
    if (result) {
      return result;
    }
    var entityType = entity.type.toUpperCase();
    filterByEditorId(extensionEntities, editorId).find(function (entityItem) {
      if (entityItem.entityType === entityType) {
        result = entityItem.exporter ? entityItem.exporter(entity, originalText) : undefined;
        return true;
      }
      return false;
    });
    return result;
  };
};
var compositeBlockImportFn = function compositeBlockImportFn(blockImportFn, editorId) {
  return function (nodeName, node, source) {
    var result = blockImportFn ? blockImportFn(nodeName, node, source) : null;
    if (result) {
      return result;
    }
    filterByEditorId(blockImporters, editorId).find(function (blockImporter) {
      var matched = blockImporter.importer ? blockImporter.importer(nodeName, node, source) : undefined;
      if (matched) {
        result = matched;
      }
      return !!matched;
    });
    return result;
  };
};
var compositeBlockExportFn = function compositeBlockExportFn(blockExportFn, editorId) {
  return function (contentState, block) {
    var result = blockExportFn ? blockExportFn(contentState, block) : null;
    if (result) {
      return result;
    }
    filterByEditorId(blockExporters, editorId).find(function (blockExporter) {
      var matched = blockExporter.exporter ? blockExporter.exporter(contentState, block) : undefined;
      if (matched) {
        result = matched;
      }
      return !!matched;
    });
    return result;
  };
};
var useExtension = function useExtension(extension) {
  if (extension instanceof Array) {
    extension.forEach(useExtension);
    return false;
  }
  if (!extension || !extension.type || typeof extension.type !== 'string') {
    return false;
  }
  var includeEditors = extension.includeEditors,
    excludeEditors = extension.excludeEditors;
  if (extension.type === 'control') {
    extensionControls.push({
      includeEditors: includeEditors,
      excludeEditors: excludeEditors,
      data: extension.control
    });
  } else if (extension.type === 'inline-style') {
    var inlineStyleName = extension.name.toUpperCase();
    if (extension.control) {
      extensionControls.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: _objectSpread({
          key: inlineStyleName,
          type: 'inline-style',
          command: inlineStyleName
        }, extension.control)
      });
    }
    if (extension.style) {
      extensionInlineStyleMaps.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          inlineStyleName: inlineStyleName,
          styleMap: extension.style
        }
      });
    }
    if (extension.styleFn) {
      extensionInlineStyleFns.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          inlineStyleName: inlineStyleName,
          styleFn: extension.styleFn
        }
      });
    }
    if (extension.importer) {
      inlineStyleImporters.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          inlineStyleName: inlineStyleName,
          importer: extension.importer
        }
      });
    }
    inlineStyleExporters.push({
      includeEditors: includeEditors,
      excludeEditors: excludeEditors,
      data: {
        inlineStyleName: inlineStyleName,
        exporter: extension.exporter ? extension.exporter(extension) : /*#__PURE__*/external_react_default().createElement("span", {
          style: extension.style
        })
      }
    });
  } else if (extension.type === 'block-style') {
    // TODO
  } else if (extension.type === 'entity') {
    var entityType = extension.name.toUpperCase();
    if (extension.control) {
      extensionControls.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: _objectSpread({}, typeof extension.control === 'function' && _objectSpread({
          key: entityType,
          type: 'entity',
          command: entityType,
          data: {
            mutability: extension.mutability || 'MUTABLE',
            data: extension.data || {}
          }
        }, extension.control))
      });
    }
    extensionEntities.push({
      includeEditors: includeEditors,
      excludeEditors: excludeEditors,
      data: {
        entityType: entityType,
        importer: extension.importer,
        exporter: extension.exporter
      }
    });
    extensionDecorators.push({
      includeEditors: includeEditors,
      excludeEditors: excludeEditors,
      data: {
        type: 'entity',
        decorator: {
          key: entityType,
          component: extension.component
        }
      }
    });
  } else if (extension.type === 'block') {
    var blockType = extension.name;
    if (extension.renderMap) {
      extensionBlockRenderMaps.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          blockType: blockType,
          renderMap: extension.renderMap
        }
      });
    }
    if (extension.rendererFn) {
      extensionBlockRendererFns.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          blockType: blockType,
          rendererFn: extension.rendererFn
        }
      });
    }
    if (extension.importer) {
      blockImporters.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          blockType: blockType,
          importer: extension.importer
        }
      });
    }
    if (extension.exporter) {
      blockExporters.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          blockType: blockType,
          exporter: extension.exporter
        }
      });
    }
  } else if (extension.type === 'atomic') {
    // TODO
  } else if (extension.type === 'decorator') {
    var decorator = extension.decorator;
    if (decorator && decorator.strategy && decorator.component) {
      extensionDecorators.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          type: 'strategy',
          decorator: decorator
        }
      });
    } else if (decorator && decorator.getDecorations) {
      extensionDecorators.push({
        includeEditors: includeEditors,
        excludeEditors: excludeEditors,
        data: {
          type: 'class',
          decorator: decorator
        }
      });
    }
  } else if (extension.type === 'prop-interception') {
    propInterceptors.push({
      includeEditors: includeEditors,
      excludeEditors: excludeEditors,
      data: extension.interceptor
    });
  }
  return true;
};
var createExtensibleEditor = function createExtensibleEditor(BraftEditor) {
  BraftEditor.use = useExtension;
  return BraftEditor;
};
// EXTERNAL MODULE: external "immutable"
var external_immutable_ = __webpack_require__(292);
// EXTERNAL MODULE: external "draft-js"
var external_draft_js_ = __webpack_require__(256);
;// CONCATENATED MODULE: ./renderers/block/blockRenderMap.jsx




/* harmony default export */ const blockRenderMap = (function (props, blockRenderMap) {
  var customBlockRenderMap = (0,external_immutable_.Map)({
    atomic: {
      element: ''
    },
    'code-block': {
      element: 'code',
      wrapper: /*#__PURE__*/external_react_default().createElement("pre", {
        className: "braft-code-block"
      })
    }
  });
  try {
    var extensionBlockRenderMaps = getExtensionBlockRenderMaps(props.editorId);
    customBlockRenderMap = extensionBlockRenderMaps.reduce(function (acc, item) {
      return acc.merge(typeof item.renderMap === 'function' ? item.renderMap(props) : item.renderMap);
    }, customBlockRenderMap);
    if (blockRenderMap) {
      if (typeof blockRenderMap === 'function') {
        customBlockRenderMap = customBlockRenderMap.merge(blockRenderMap(props));
      } else {
        customBlockRenderMap = customBlockRenderMap.merge(blockRenderMap);
      }
    }
    customBlockRenderMap = external_draft_js_.DefaultDraftBlockRenderMap.merge(customBlockRenderMap);
  } catch (error) {
    console.warn(error);
  }
  return customBlockRenderMap;
});
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
// EXTERNAL MODULE: ../node_modules/prop-types/index.js
var prop_types = __webpack_require__(615);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ const esm_browser_validate = (validate);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ../node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
// EXTERNAL MODULE: external "braft-utils-2"
var external_braft_utils_2_ = __webpack_require__(601);
;// CONCATENATED MODULE: ./configs/controls.jsx

/* harmony default export */ const configs_controls = (function (lang, editor) {
  return [{
    key: 'undo',
    title: lang.controls.undo,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-undo"
    }),
    type: 'editor-method',
    command: 'undo'
  }, {
    key: 'redo',
    title: lang.controls.redo,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-redo"
    }),
    type: 'editor-method',
    command: 'redo'
  }, {
    key: 'remove-styles',
    title: lang.controls.removeStyles,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-format_clear"
    }),
    type: 'editor-method',
    command: 'removeSelectionInlineStyles'
  }, {
    key: 'hr',
    title: lang.controls.hr,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-hr"
    }),
    type: 'editor-method',
    command: 'insertHorizontalLine'
  }, {
    key: 'bold',
    title: lang.controls.bold,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-bold"
    }),
    type: 'inline-style',
    command: 'bold'
  }, {
    key: 'italic',
    title: lang.controls.italic,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-italic"
    }),
    type: 'inline-style',
    command: 'italic'
  }, {
    key: 'underline',
    title: lang.controls.underline,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-underlined"
    }),
    type: 'inline-style',
    command: 'underline'
  }, {
    key: 'strike-through',
    title: lang.controls.strikeThrough,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-strikethrough"
    }),
    type: 'inline-style',
    command: 'strikethrough'
  }, {
    key: 'superscript',
    title: lang.controls.superScript,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-superscript"
    }),
    type: 'inline-style',
    command: 'superscript'
  }, {
    key: 'subscript',
    title: lang.controls.subScript,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-subscript"
    }),
    type: 'inline-style',
    command: 'subscript'
  }, {
    key: 'headings',
    title: lang.controls.headings,
    type: 'headings'
  }, {
    key: 'blockquote',
    title: lang.controls.blockQuote,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-quote"
    }),
    type: 'block-type',
    command: 'blockquote'
  }, {
    key: 'code',
    title: lang.controls.code,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-code"
    }),
    type: 'block-type',
    command: 'code-block'
  }, {
    key: 'list-ul',
    title: lang.controls.unorderedList,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-list"
    }),
    type: 'block-type',
    command: 'unordered-list-item'
  }, {
    key: 'list-ol',
    title: lang.controls.orderedList,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-list-numbered"
    }),
    type: 'block-type',
    command: 'ordered-list-item'
  }, {
    key: 'link',
    title: lang.controls.link,
    type: 'link'
  }, {
    key: 'text-color',
    title: lang.controls.color,
    type: 'text-color'
  }, {
    key: 'line-height',
    title: lang.controls.lineHeight,
    type: 'line-height'
  }, {
    key: 'letter-spacing',
    title: lang.controls.letterSpacing,
    type: 'letter-spacing'
  }, {
    key: 'text-indent',
    title: lang.controls.textIndent,
    type: 'text-indent'
  }, {
    key: 'font-size',
    title: lang.controls.fontSize,
    type: 'font-size'
  }, {
    key: 'font-family',
    title: lang.controls.fontFamily,
    type: 'font-family'
  }, {
    key: 'text-align',
    title: lang.controls.textAlign,
    type: 'text-align'
  }, {
    key: 'media',
    title: lang.controls.media,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-media"
    }),
    type: 'media'
  }, {
    key: 'emoji',
    title: lang.controls.emoji,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-emoji"
    }),
    type: 'emoji'
  }, {
    key: 'clear',
    title: lang.controls.clear,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: "bfi-clear_all"
    }),
    type: 'editor-method',
    command: 'clearEditorContent'
  }, {
    key: 'fullscreen',
    title: editor.state.isFullscreen ? lang.controls.exitFullscreen : lang.controls.fullscreen,
    text: /*#__PURE__*/external_react_default().createElement("i", {
      className: editor.state.isFullscreen ? 'bfi-fullscreen-exit' : 'bfi-fullscreen'
    }),
    type: 'editor-method',
    command: 'toggleFullscreen'
  }, {
    key: 'modal',
    type: 'modal'
  }, {
    key: 'button',
    type: 'button'
  }, {
    key: 'dropdown',
    type: 'dropdown'
  }, {
    key: 'component',
    type: 'component'
  }];
});
var imageControlItems = {
  'float-left': {
    text: /*#__PURE__*/external_react_default().createElement("span", {
      "data-float": "left"
    }, "\uE91E"),
    command: 'setImageFloat|left'
  },
  'float-right': {
    text: /*#__PURE__*/external_react_default().createElement("span", {
      "data-float": "right"
    }, "\uE914"),
    command: 'setImageFloat|right'
  },
  'align-left': {
    text: /*#__PURE__*/external_react_default().createElement("span", {
      "data-align": "left"
    }, "\uE027"),
    command: 'setImageAlignment|left'
  },
  'align-center': {
    text: /*#__PURE__*/external_react_default().createElement("span", {
      "data-align": "center"
    }, "\uE028"),
    command: 'setImageAlignment|center'
  },
  'align-right': {
    text: /*#__PURE__*/external_react_default().createElement("span", {
      "data-align": "right"
    }, "\uE029"),
    command: 'setImageAlignment|right'
  },
  size: {
    text: /*#__PURE__*/external_react_default().createElement("span", null, "\uE3C2"),
    command: 'toggleSizeEditor'
  },
  link: {
    text: /*#__PURE__*/external_react_default().createElement("span", null, "\uE91A"),
    command: 'toggleLinkEditor'
  },
  remove: {
    text: /*#__PURE__*/external_react_default().createElement("span", null, "\uE9AC"),
    command: 'removeImage'
  }
};
;// CONCATENATED MODULE: ../node_modules/@inner-desktop/mergeclassnames/dist/mergeClassNames.js
const mergeClassNames = (...classNames) => {
    const flatArray = (inputArray) => inputArray.reduce((arr, item) => {
        if (Array.isArray(item)) {
            return arr.concat(flatArray(item));
        }
        if (typeof item === 'string') {
            const splitItem = item.split(' ');
            if (splitItem.length > 1) {
                return arr.concat(splitItem);
            }
            return arr.concat(item);
        }
        return [...arr];
    }, []);
    const flatten = classNames.reduce((names, name) => {
        if (typeof name === 'string') {
            return names.concat(name);
        }
        if (Array.isArray(name)) {
            return names.concat(flatArray(name));
        }
        return [...names];
    }, []);
    return Array.from(new Set(flatten.filter((x) => typeof x === 'string')))
        .join(' ')
        .trim();
};
/* harmony default export */ const dist_mergeClassNames = (mergeClassNames);
//# sourceMappingURL=mergeClassNames.js.map
;// CONCATENATED MODULE: ./components/common/Switch/index.jsx




function Switch(props) {
  var active = props.active,
    _onClick = props.onClick,
    className = props.className;
  return /*#__PURE__*/external_react_default().createElement("div", {
    role: "presentation",
    onClick: function onClick() {
      return _onClick();
    },
    className: dist_mergeClassNames('bf-switch', className, active && 'active')
  });
}
Switch.defaultProps = {
  onClick: function onClick() {
    return null;
  }
};
Switch.propTypes = {
  active: (prop_types_default()).any,
  onClick: (prop_types_default()).any,
  className: (prop_types_default()).any
};
/* harmony default export */ const common_Switch = (Switch);
;// CONCATENATED MODULE: ./renderers/atomics/Image/index.jsx









function Image_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function Image_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? Image_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : Image_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */







var Image = /*#__PURE__*/function (_React$Component) {
  _inherits(Image, _React$Component);
  var _super = _createSuper(Image);
  function Image() {
    var _this;
    _classCallCheck(this, Image);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "state", {
      toolbarVisible: false,
      toolbarOffset: 0,
      linkEditorVisible: false,
      sizeEditorVisible: false,
      tempLink: null,
      tempWidth: null,
      tempHeight: null
    });
    _defineProperty(_assertThisInitialized(_this), "imageElement", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "mediaEmbederInstance", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "toolbarElement", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "initialLeft", void 0);
    _defineProperty(_assertThisInitialized(_this), "initialTop", void 0);
    _defineProperty(_assertThisInitialized(_this), "initialWidth", void 0);
    _defineProperty(_assertThisInitialized(_this), "initialHeight", void 0);
    _defineProperty(_assertThisInitialized(_this), "reSizeType", void 0);
    _defineProperty(_assertThisInitialized(_this), "zoom", void 0);
    _defineProperty(_assertThisInitialized(_this), "changeSize", function (e) {
      var type = _this.reSizeType;
      if (!_this.initialLeft) {
        _this.initialLeft = e.screenX;
        _this.initialTop = e.screenY;
      }
      if (type === 'rightbottom') {
        _this.initialHeight += e.screenY - _this.initialTop;
        _this.initialWidth += e.screenX - _this.initialLeft;
      }
      if (type === 'leftbottom') {
        _this.initialHeight += e.screenY - _this.initialTop;
        _this.initialWidth += -e.screenX + _this.initialLeft;
      }
      _this.initialLeft = e.screenX;
      _this.initialTop = e.screenY;
    });
    _defineProperty(_assertThisInitialized(_this), "moveImage", function (e) {
      _this.changeSize(e);
      _this.setState({
        tempWidth: Math.abs(_this.initialWidth),
        tempHeight: Math.abs(_this.initialHeight)
      });
    });
    _defineProperty(_assertThisInitialized(_this), "upImage", function () {
      var imageEqualRatio = _this.props.imageEqualRatio;
      if (imageEqualRatio) {
        _this.confirmImageSizeEqualRatio();
      } else {
        _this.confirmImageSize();
      }
      document.removeEventListener('mousemove', _this.moveImage);
      document.removeEventListener('mouseup', _this.upImage);
    });
    _defineProperty(_assertThisInitialized(_this), "repareChangeSize", function (type) {
      return function (e) {
        _this.reSizeType = type;
        var imageRect = _this.imageElement.current.getBoundingClientRect();
        _this.initialTop = 0;
        _this.initialLeft = 0;
        _this.initialWidth = imageRect.width;
        _this.initialHeight = imageRect.height;
        _this.zoom = imageRect.width / imageRect.height;
        e.preventDefault();
        document.addEventListener('mousemove', _this.moveImage);
        document.addEventListener('mouseup', _this.upImage);
      };
    });
    _defineProperty(_assertThisInitialized(_this), "preventDragEvent", function (event) {
      event.stopPropagation();
      event.preventDefault();
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function () {
      if (_this.props.editor.editorProps.readOnly || _this.props.editor.editorProps.disabled) {
        return false;
      }
      window.__BRAFT_DRAGING__IMAGE__ = {
        block: _this.props.block,
        mediaData: Image_objectSpread({
          type: 'IMAGE'
        }, _this.props.mediaData)
      };
      _this.setState({
        toolbarVisible: false
      }, function () {
        _this.unlockEditor();
      });
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "handleDragEnd", function () {
      window.__BRAFT_DRAGING__IMAGE__ = null;
      return false;
    });
    _defineProperty(_assertThisInitialized(_this), "executeCommand", function (command) {
      if (typeof command === 'string') {
        var _command$split = command.split('|'),
          _command$split2 = _slicedToArray(_command$split, 2),
          method = _command$split2[0],
          param = _command$split2[1];
        if (_this[method]) {
          _this[method](param);
        }
      } else if (typeof command === 'function') {
        command(_this.props.block, _this.props.mediaData, _this.props.editor.getValue());
      }
    });
    _defineProperty(_assertThisInitialized(_this), "removeImage", function () {
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.removeBlock(_this.props.editor.getValue(), _this.props.block));
      _this.unlockEditor();
    });
    _defineProperty(_assertThisInitialized(_this), "toggleLinkEditor", function () {
      _this.setState(function (prevState) {
        return {
          linkEditorVisible: !prevState.linkEditorVisible,
          sizeEditorVisible: false
        };
      });
    });
    _defineProperty(_assertThisInitialized(_this), "toggleSizeEditor", function () {
      _this.setState(function (prevState) {
        return {
          linkEditorVisible: false,
          sizeEditorVisible: !prevState.sizeEditorVisible
        };
      });
    });
    _defineProperty(_assertThisInitialized(_this), "handleLinkInputKeyDown", function (e) {
      if (e.keyCode === 13) {
        _this.confirmImageLink();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "setImageLink", function (e) {
      _this.setState({
        tempLink: e.currentTarget.value
      });
    });
    _defineProperty(_assertThisInitialized(_this), "confirmImageLink", function () {
      var link = _this.state.tempLink;
      var hookReturns = _this.props.hooks('set-image-link', link)(link);
      if (hookReturns === false) {
        return false;
      }
      if (typeof hookReturns === 'string') {
        link = hookReturns;
      }
      if (link !== null) {
        _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.setMediaData(_this.props.editor.getValue(), _this.props.entityKey, {
          link: link
        }));
        window.setImmediate(_this.props.editor.forceRender);
      }
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "handleSizeInputKeyDown", function (e) {
      if (e.keyCode === 13) {
        _this.confirmImageSize();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "setImageWidth", function (_ref) {
      var currentTarget = _ref.currentTarget;
      var value = currentTarget.value;
      if (value && !isNaN(value)) {
        value += 'px';
      }
      _this.setState({
        tempWidth: value
      });
    });
    _defineProperty(_assertThisInitialized(_this), "setImageHeight", function (_ref2) {
      var currentTarget = _ref2.currentTarget;
      var value = currentTarget.value;
      if (value && !isNaN(value)) {
        value += 'px';
      }
      _this.setState({
        tempHeight: value
      });
    });
    _defineProperty(_assertThisInitialized(_this), "confirmImageSize", function () {
      var _this$state = _this.state,
        width = _this$state.tempWidth,
        height = _this$state.tempHeight;
      var newImageSize = {};
      if (width !== null) {
        newImageSize.width = width;
      }
      if (height !== null) {
        newImageSize.height = height;
      }
      var hookReturns = _this.props.hooks('set-image-size', newImageSize)(newImageSize);
      if (hookReturns === false) {
        return false;
      }
      if (hookReturns && (hookReturns.width || hookReturns.height)) {
        newImageSize = hookReturns;
      }
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.setMediaData(_this.props.editor.getValue(), _this.props.entityKey, newImageSize));
      window.setImmediate(_this.props.editor.forceRender);
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "confirmImageSizeEqualRatio", function () {
      var _this$state2 = _this.state,
        width = _this$state2.tempWidth,
        height = _this$state2.tempHeight;
      var equalWidth;
      var equalHeight;
      var newImageSize = {};
      // 宽度过大 图片等比缩放
      if (width / height > _this.zoom) {
        equalWidth = Math.floor(height * _this.zoom);
        _this.setState({
          tempWidth: equalWidth
        });
        equalHeight = height;
      } else if (width / height < _this.zoom) {
        equalHeight = Math.floor(width / _this.zoom);
        _this.setState({
          tempHeight: equalHeight
        });
        equalWidth = width;
      }
      if (equalWidth !== null) {
        newImageSize.width = equalWidth;
      }
      if (equalHeight !== null) {
        newImageSize.height = equalHeight;
      }
      var hookReturns = _this.props.hooks('set-image-size', newImageSize)(newImageSize);
      if (hookReturns === false) {
        return false;
      }
      if (hookReturns && (hookReturns.width || hookReturns.height)) {
        newImageSize = hookReturns;
      }
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.setMediaData(_this.props.editor.getValue(), _this.props.entityKey, newImageSize));
      window.setImmediate(_this.props.editor.forceRender);
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "setImageFloat", function (float) {
      var newFloat = float;
      var hookReturns = _this.props.hooks('set-image-float', newFloat)(newFloat);
      if (hookReturns === false) {
        return false;
      }
      if (typeof hookReturns === 'string') {
        newFloat = hookReturns;
      }
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.setMediaPosition(_this.props.editor.getValue(), _this.props.block, {
        newFloat: newFloat
      }));
      _this.unlockEditor();
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "setImageAlignment", function (alignment) {
      var newAlignment = alignment;
      var hookReturns = _this.props.hooks('set-image-alignment', newAlignment)(newAlignment);
      if (hookReturns === false) {
        return false;
      }
      if (typeof hookReturns === 'string') {
        newAlignment = hookReturns;
      }
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.setMediaPosition(_this.props.editor.getValue(), _this.props.block, {
        newAlignment: newAlignment
      }));
      _this.unlockEditor();
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "showToolbar", function (event) {
      if (_this.props.editor.editorProps.readOnly || _this.props.editor.editorProps.disabled) {
        return false;
      }
      event.preventDefault();
      if (!_this.state.toolbarVisible) {
        _this.setState({
          toolbarVisible: true
        }, function () {
          _this.lockEditor();
          _this.setState({
            toolbarOffset: _this.calcToolbarOffset()
          });
        });
      }
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "hideToolbar", function (event) {
      event.preventDefault();
      _this.setState({
        toolbarVisible: false
      }, function () {
        _this.unlockEditor();
        // this.props.editor.requestFocus()
      });
    });
    return _this;
  }
  _createClass(Image, [{
    key: "lockEditor",
    value: function lockEditor() {
      this.props.editor.lockOrUnlockEditor(true);
    }
  }, {
    key: "unlockEditor",
    value: function unlockEditor() {
      this.props.editor.lockOrUnlockEditor(false);
    }
  }, {
    key: "calcToolbarOffset",
    value: function calcToolbarOffset() {
      var _this$props = this.props,
        getContainerNode = _this$props.getContainerNode,
        containerNode = _this$props.containerNode;
      var container = getContainerNode ? getContainerNode() : containerNode;
      if (!container) {
        return 0;
      }
      var viewRect = container.querySelector('.bf-content').getBoundingClientRect();
      var toolbarRect = this.toolbarElement.current.getBoundingClientRect();
      var imageRect = this.imageElement.current.getBoundingClientRect();
      var right = viewRect.right - (imageRect.right - imageRect.width / 2 + toolbarRect.width / 2);
      var left = imageRect.left + imageRect.width / 2 - toolbarRect.width / 2 - viewRect.left;
      if (right < 10) {
        return right - 10;
      } else if (left < 10) {
        return left * -1 + 10;
      } else {
        return 0;
      }
    }
  }, {
    key: "setImageLinkTarget",
    value: function setImageLinkTarget(linkTarget) {
      var newLinkTarget;
      var hookReturns = this.props.hooks('set-image-link-target', linkTarget)(linkTarget);
      if (hookReturns === false) {
        return false;
      }
      if (typeof hookReturns === 'string') {
        newLinkTarget = hookReturns;
      }
      newLinkTarget = newLinkTarget === '_blank' ? '' : '_blank';
      this.props.editor.setValue(external_braft_utils_2_.ContentUtils.setMediaData(this.props.editor.getValue(), this.props.entityKey, {
        newLinkTarget: newLinkTarget
      }));
      window.setImmediate(this.props.editor.forceRender);
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props2 = this.props,
        mediaData = _this$props2.mediaData,
        language = _this$props2.language,
        imageControls = _this$props2.imageControls,
        imageResizable = _this$props2.imageResizable;
      var _this$state3 = this.state,
        toolbarVisible = _this$state3.toolbarVisible,
        toolbarOffset = _this$state3.toolbarOffset,
        linkEditorVisible = _this$state3.linkEditorVisible,
        sizeEditorVisible = _this$state3.sizeEditorVisible,
        tempWidth = _this$state3.tempWidth,
        tempHeight = _this$state3.tempHeight;
      var blockData = this.props.block.getData();
      var float = blockData.get('float');
      var alignment = blockData.get('alignment');
      var url = mediaData.url,
        link = mediaData.link,
        linkTarget = mediaData.linkTarget,
        width = mediaData.width,
        height = mediaData.height,
        meta = mediaData.meta;
      var imageStyles = {};
      var clearFix = false;
      if (float) {
        alignment = null;
      } else if (alignment === 'left') {
        imageStyles.float = 'left';
        clearFix = true;
      } else if (alignment === 'right') {
        imageStyles.float = 'right';
        clearFix = true;
      } else if (alignment === 'center') {
        imageStyles.textAlign = 'center';
      } else {
        imageStyles.float = 'left';
        clearFix = true;
      }
      var renderedControlItems = imageControls.map(function (item) {
        if (typeof item === 'string' && imageControlItems[item]) {
          return /*#__PURE__*/external_react_default().createElement("a", {
            className: item === 'link' && link ? 'active' : '',
            role: "presentation",
            key: esm_browser_v4(),
            onClick: function onClick() {
              return _this2.executeCommand(imageControlItems[item].command);
            }
          }, imageControlItems[item].text);
        } else if (item && (item.render || item.text)) {
          return item.render ? item.render(mediaData, _this2.props.block) : /*#__PURE__*/external_react_default().createElement("a", {
            key: esm_browser_v4(),
            role: "presentation",
            onClick: function onClick() {
              return item.onClick && _this2.executeCommand(item.onClick);
            }
          }, item.text);
        } else {
          return null;
        }
      });
      return /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-media"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        style: imageStyles,
        draggable: true,
        onMouseEnter: this.showToolbar,
        onMouseMove: this.showToolbar,
        onMouseLeave: this.hideToolbar,
        onDragStart: this.handleDragStart,
        onDragEnd: this.handleDragEnd,
        ref: this.mediaEmbederInstance,
        className: "bf-image"
      }, toolbarVisible ? /*#__PURE__*/external_react_default().createElement("div", {
        style: {
          marginLeft: toolbarOffset
        },
        ref: this.toolbarElement,
        "data-float": float,
        "data-align": alignment,
        className: "bf-media-toolbar"
      }, linkEditorVisible ? /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-image-link-editor"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "editor-input-group"
      }, /*#__PURE__*/external_react_default().createElement("input", {
        type: "text",
        placeholder: language.linkEditor.inputWithEnterPlaceHolder,
        onKeyDown: this.handleLinkInputKeyDown,
        onChange: this.setImageLink,
        defaultValue: link
      }), /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.confirmImageLink
      }, language.base.confirm)), /*#__PURE__*/external_react_default().createElement("div", {
        className: "switch-group"
      }, /*#__PURE__*/external_react_default().createElement(common_Switch, {
        active: linkTarget === '_blank',
        onClick: function onClick() {
          return _this2.setImageLinkTarget(linkTarget);
        }
      }), /*#__PURE__*/external_react_default().createElement("label", null, language.linkEditor.openInNewWindow))) : null, sizeEditorVisible ? /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-image-size-editor"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "editor-input-group"
      }, /*#__PURE__*/external_react_default().createElement("input", {
        type: "text",
        placeholder: language.base.width,
        onKeyDown: this.handleSizeInputKeyDown,
        onChange: this.setImageWidth,
        defaultValue: width
      }), /*#__PURE__*/external_react_default().createElement("input", {
        type: "text",
        placeholder: language.base.height,
        onKeyDown: this.handleSizeInputKeyDown,
        onChange: this.setImageHeight,
        defaultValue: height
      }), /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.confirmImageSize
      }, language.base.confirm))) : null, renderedControlItems, /*#__PURE__*/external_react_default().createElement("i", {
        style: {
          marginLeft: toolbarOffset * -1
        },
        className: "bf-media-toolbar-arrow"
      })) : null, /*#__PURE__*/external_react_default().createElement("div", {
        style: {
          position: 'relative',
          width: "".concat(width, "px"),
          height: "".concat(height, "px"),
          display: 'inline-block'
        }
      }, /*#__PURE__*/external_react_default().createElement("img", _extends({
        ref: this.imageElement,
        src: url,
        alt: "Alt",
        width: width,
        height: height
      }, meta)), toolbarVisible && imageResizable ? /*#__PURE__*/external_react_default().createElement("div", {
        role: "presentation",
        className: "bf-csize-icon right-bottom",
        onMouseDown: this.repareChangeSize('rightbottom')
      }) : null, toolbarVisible && imageResizable ? /*#__PURE__*/external_react_default().createElement("div", {
        role: "presentation",
        className: "bf-csize-icon left-bottom",
        onMouseDown: this.repareChangeSize('leftbottom')
      }) : null, /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-pre-csize ".concat(this.reSizeType),
        style: {
          width: "".concat(tempWidth, "px"),
          height: "".concat(tempHeight, "px")
        }
      }))), clearFix && /*#__PURE__*/external_react_default().createElement("div", {
        className: "clearfix",
        style: {
          clear: 'both',
          height: 0,
          lineHeight: 0,
          float: 'none'
        }
      }));
    }
  }]);
  return Image;
}((external_react_default()).Component);
Image.propTypes = {
  hooks: (prop_types_default()).any,
  entityKey: (prop_types_default()).any,
  block: (prop_types_default()).any,
  mediaData: (prop_types_default()).any,
  imageEqualRatio: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  containerNode: (prop_types_default()).any,
  language: (prop_types_default()).any,
  imageControls: (prop_types_default()).any,
  imageResizable: (prop_types_default()).any
};
/* harmony default export */ const atomics_Image = (Image);
// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__(111);
var external_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_react_dom_);
;// CONCATENATED MODULE: ./components/common/Modal/index.jsx








function Modal_createSuper(Derived) { var hasNativeReflectConstruct = Modal_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function Modal_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function Modal_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function Modal_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? Modal_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : Modal_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/* eslint-disable react/no-render-return-value */






var showModal = function showModal(props) {
  var hostNode = document.createElement('div');
  var newProps = Modal_objectSpread({
    visible: true,
    closeOnConfirm: true,
    closeOnCancel: true
  }, props);
  hostNode.style.display = 'none';
  document.body.appendChild(hostNode);
  var close = function close() {
    if (external_react_dom_default().unmountComponentAtNode(hostNode)) {
      hostNode.parentNode.removeChild(hostNode);
    }
  };
  var onConfirm = function onConfirm() {
    if (newProps.onConfirm) {
      newProps.onConfirm();
    }
  };
  var onCancel = function onCancel() {
    if (newProps.onCancel) {
      newProps.onCancel();
    }
  };
  var onClose = function onClose() {
    close();
    if (newProps.onClose) {
      newProps.onClose();
    }
  };
  var modalInstance = external_react_dom_default().render( /*#__PURE__*/external_react_default().createElement(Modal, _extends({}, newProps, {
    onConfirm: onConfirm,
    onCancel: onCancel,
    onClose: onClose
  })), hostNode);
  modalInstance.destroy = close;
  modalInstance.update = modalInstance.renderComponent;
  return modalInstance;
};
var Modal = /*#__PURE__*/function (_React$Component) {
  _inherits(Modal, _React$Component);
  var _super = Modal_createSuper(Modal);
  function Modal(props) {
    var _this;
    _classCallCheck(this, Modal);
    _this = _super.call(this, props);
    // eslint-disable-next-line camelcase
    /* UNSAFE_componentWillReceiveProps(next) {
      if (this.props.visible && !next.visible) {
        this.unrenderComponent();
      } else if (this.props.visible || next.visible) {
        this.active = true;
        this.renderComponent(next);
      }
    } */
    _defineProperty(_assertThisInitialized(_this), "handleTransitionEnd", function () {
      if (!_this.rootElement || !_this.rootElement.classList) {
        return false;
      }
      if (!_this.rootElement.classList.contains('active')) {
        if (external_react_dom_default().unmountComponentAtNode(_this.rootElement)) {
          _this.rootElement.parentNode.removeChild(_this.rootElement);
        }
      }
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseDown", function (event) {
      var tagName = event.target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        return false;
      }
      event.preventDefault();
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "handleCancel", function () {
      if (_this.props.closeOnCancel) {
        _this.close();
      }
      if (_this.props.onCancel) {
        _this.props.onCancel();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleConfirm", function () {
      if (_this.props.closeOnConfirm) {
        _this.close();
      }
      if (_this.props.onConfirm) {
        _this.props.onConfirm();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleMaskClick", function () {
      if (_this.props.closeOnBlur) {
        _this.close();
      }
      if (_this.props.onBlue) {
        _this.props.onBlue();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "close", function () {
      _this.unrenderComponent();
      if (_this.props.onClose) {
        _this.props.onClose();
      }
    });
    _this.active = false;
    _this.state = {
      visible: !!props.visible,
      exec: false
    };

    // eslint-disable-next-line new-cap
    _this.componentId = "BRAFT-MODAL-".concat(external_braft_utils_2_.BaseUtils.UniueIndex());
    return _this;
  }
  _createClass(Modal, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.exec) {
        if (this.state.visible) {
          this.active = true;
          this.renderComponent(this.props);
        } else {
          this.unrenderComponent();
        }
        this.setState({
          exec: true
        });
      }
    }

    // eslint-disable-next-line react/sort-comp
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.visible) {
        this.active = true;
        this.renderComponent(this.props);
      }
    }
  }, {
    key: "unrenderComponent",
    value: function unrenderComponent() {
      this.active = false;
      if (this.activeId) {
        window.clearImmediate(this.activeId);
      }
      if (this.rootElement && this.rootElement.classList) {
        this.rootElement.classList.remove('active');
      }
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      var _this2 = this;
      if (!this.active) {
        return false;
      }
      var title = props.title,
        className = props.className,
        width = props.width,
        height = props.height,
        children = props.children,
        component = props.component,
        confirmable = props.confirmable,
        showFooter = props.showFooter,
        showCancel = props.showCancel,
        showConfirm = props.showConfirm,
        showClose = props.showClose,
        cancelText = props.cancelText,
        confirmText = props.confirmText,
        bottomText = props.bottomText,
        language = props.language;
      var childComponent = /*#__PURE__*/external_react_default().createElement("div", {
        role: "presentation",
        onMouseDown: this.handleMouseDown,
        className: "bf-modal ".concat(className || '')
      }, /*#__PURE__*/external_react_default().createElement("div", {
        role: "presentation",
        className: "bf-modal-mask",
        onClick: this.handleMaskClick
      }), /*#__PURE__*/external_react_default().createElement("div", {
        onTransitionEnd: this.handleTransitionEnd,
        style: {
          width: width,
          height: height
        },
        className: "bf-modal-content"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-modal-header"
      }, /*#__PURE__*/external_react_default().createElement("h3", {
        className: "bf-modal-caption"
      }, title), showClose && /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.close,
        className: "bf-modal-close-button"
      }, /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-close"
      }))), /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-modal-body"
      }, children || component), showFooter ? /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-modal-footer"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-modal-addon-text"
      }, bottomText), /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-modal-buttons"
      }, showCancel && /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.handleCancel,
        className: "bf-modal-cancel"
      }, cancelText || language.base.cancel), showConfirm && /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.handleConfirm,
        className: dist_mergeClassNames('bf-modal-confirm', !confirmable && 'disabled')
      }, confirmText || language.base.confirm))) : null));
      this.rootElement = document.querySelector("#".concat(this.componentId));
      if (!this.rootElement) {
        this.rootElement = document.createElement('div');
        this.rootElement.id = this.componentId;
        this.rootElement.className = 'bf-modal-root';
        document.body.appendChild(this.rootElement);
      }
      external_react_dom_default().render(childComponent, this.rootElement);
      this.activeId = window.setImmediate(function () {
        _this2.rootElement.classList.add('active');
      });
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.visible !== !!(nextProps !== null && nextProps !== void 0 && nextProps.visible)) {
        return {
          visible: !!nextProps.visible,
          exec: true
        };
      }
      return null;
    }
  }]);
  return Modal;
}((external_react_default()).Component);
Modal.defaultProps = {
  closeOnBlur: true,
  showCancel: true,
  showClose: true,
  showConfirm: true,
  showFooter: true
};
Modal.propTypes = {
  visible: (prop_types_default()).any,
  closeOnCancel: (prop_types_default()).any,
  onCancel: (prop_types_default()).any,
  closeOnConfirm: (prop_types_default()).any,
  onConfirm: (prop_types_default()).any,
  closeOnBlur: (prop_types_default()).any,
  onBlue: (prop_types_default()).any,
  onClose: (prop_types_default()).any,
  showCancel: (prop_types_default()).any,
  showClose: (prop_types_default()).any,
  showConfirm: (prop_types_default()).any,
  showFooter: (prop_types_default()).any
};
/* harmony default export */ const common_Modal = ((/* unused pure expression or super */ null && (Modal)));
;// CONCATENATED MODULE: ./components/business/PlayerModal/index.jsx




var playViaModal = function playViaModal(title, component, language) {
  return showModal({
    title: title,
    component: component,
    language: language,
    showFooter: false
  });
};
var typeIconsMap = {
  video: 'bfi-film',
  audio: 'bfi-music',
  embed: 'bfi-code'
};
var PlayerModal = function PlayerModal(_ref) {
  var title = _ref.title,
    type = _ref.type,
    language = _ref.language,
    name = _ref.name,
    url = _ref.url,
    poster = _ref.poster,
    children = _ref.children,
    onRemove = _ref.onRemove;
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-player-holder ".concat(type)
  }, /*#__PURE__*/external_react_default().createElement("div", {
    className: "icon-badge"
  }, /*#__PURE__*/external_react_default().createElement("i", {
    className: typeIconsMap[type]
  }), /*#__PURE__*/external_react_default().createElement("span", {
    className: "text"
  }, language.media[type])), /*#__PURE__*/external_react_default().createElement("button", {
    onMouseDown: onRemove,
    className: "button-remove"
  }, /*#__PURE__*/external_react_default().createElement("i", {
    className: "bfi-close"
  })), /*#__PURE__*/external_react_default().createElement("button", {
    onMouseDown: function onMouseDown() {
      return playViaModal(name ? "".concat(title, ":").concat(name) : title, children, language);
    },
    className: "button-play"
  }, /*#__PURE__*/external_react_default().createElement("i", {
    className: "bfi-play_arrow"
  })), name ? /*#__PURE__*/external_react_default().createElement("h5", {
    className: "bf-name"
  }, name) : null, /*#__PURE__*/external_react_default().createElement("h6", {
    className: "bf-url"
  }, url), poster ? /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-poster",
    style: {
      backgroundImage: "url(".concat(poster, ")")
    }
  }) : null);
};
PlayerModal.propTypes = {
  title: (prop_types_default()).any,
  type: (prop_types_default()).any,
  language: (prop_types_default()).any,
  name: (prop_types_default()).any,
  url: (prop_types_default()).any,
  poster: (prop_types_default()).any,
  children: (prop_types_default()).any,
  onRemove: (prop_types_default()).any
};
/* harmony default export */ const business_PlayerModal = (PlayerModal);
;// CONCATENATED MODULE: ./renderers/atomics/Video/index.jsx
/* eslint-disable jsx-a11y/media-has-caption */





function Video(_ref) {
  var mediaData = _ref.mediaData,
    language = _ref.language,
    editor = _ref.editor,
    editorState = _ref.editorState,
    block = _ref.block;
  var url = mediaData.url,
    name = mediaData.name,
    meta = mediaData.meta;
  var _meta$poster = meta.poster,
    poster = _meta$poster === void 0 ? '' : _meta$poster;
  var removeVideo = function removeVideo() {
    editor.setValue(external_braft_utils_2_.ContentUtils.removeBlock(editorState, block));
  };
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-video-wrap"
  }, /*#__PURE__*/external_react_default().createElement(business_PlayerModal, {
    type: "video",
    onRemove: removeVideo,
    poster: poster,
    language: language,
    url: url,
    name: name,
    title: language.videoPlayer.title
  }, /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-video-player"
  }, /*#__PURE__*/external_react_default().createElement("video", {
    controls: true,
    poster: poster
  }, /*#__PURE__*/external_react_default().createElement("source", {
    src: url
  })))));
}
Video.propTypes = {
  mediaData: (prop_types_default()).any,
  language: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  block: (prop_types_default()).any
};
/* harmony default export */ const atomics_Video = (Video);
;// CONCATENATED MODULE: ./renderers/atomics/Audio/index.jsx
/* eslint-disable jsx-a11y/media-has-caption */





function Audio(_ref) {
  var mediaData = _ref.mediaData,
    language = _ref.language,
    editor = _ref.editor,
    editorState = _ref.editorState,
    block = _ref.block;
  var url = mediaData.url,
    name = mediaData.name,
    meta = mediaData.meta;
  var removeAudio = function removeAudio() {
    editor.setValue(external_braft_utils_2_.ContentUtils.removeBlock(editorState, block));
  };
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-audio-wrap"
  }, /*#__PURE__*/external_react_default().createElement(business_PlayerModal, {
    type: "audio",
    onRemove: removeAudio,
    poster: meta ? meta.poster || '' : '',
    language: language,
    url: url,
    name: name,
    title: language.audioPlayer.title
  }, /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-audio-player"
  }, /*#__PURE__*/external_react_default().createElement("audio", {
    controls: true,
    src: url
  }))));
}
Audio.propTypes = {
  mediaData: (prop_types_default()).any,
  language: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  block: (prop_types_default()).any
};
/* harmony default export */ const atomics_Audio = (Audio);
;// CONCATENATED MODULE: ./renderers/atomics/Embed/index.jsx
/* eslint-disable react/no-danger */





function Embed(_ref) {
  var mediaData = _ref.mediaData,
    language = _ref.language,
    editor = _ref.editor,
    editorState = _ref.editorState,
    block = _ref.block;
  var name = mediaData.name,
    url = mediaData.url,
    meta = mediaData.meta;
  var removeEmbed = function removeEmbed() {
    editor.setValue(external_braft_utils_2_.ContentUtils.removeBlock(editorState, block));
  };
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-embed-wrap"
  }, /*#__PURE__*/external_react_default().createElement(business_PlayerModal, {
    type: "embed",
    onRemove: removeEmbed,
    poster: meta ? meta.poster || '' : '',
    language: language,
    url: url,
    name: name,
    title: language.videoPlayer.embedTitle
  }, /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-embed-player",
    dangerouslySetInnerHTML: {
      __html: url
    }
  })));
}
Embed.propTypes = {
  mediaData: (prop_types_default()).any,
  language: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  block: (prop_types_default()).any
};
/* harmony default export */ const atomics_Embed = (Embed);
;// CONCATENATED MODULE: ./renderers/atomics/HorizontalLine/index.jsx




function HorizontalLine(_ref) {
  var editorState = _ref.editorState,
    block = _ref.block,
    editor = _ref.editor;
  var removeHorizontalLine = function removeHorizontalLine() {
    editor.setValue(external_braft_utils_2_.ContentUtils.removeBlock(editorState, block));
  };
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-hr"
  }, /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-media-toolbar"
  }, /*#__PURE__*/external_react_default().createElement("a", {
    role: "presentation",
    onClick: removeHorizontalLine
  }, "\uE9AC")));
}
HorizontalLine.propTypes = {
  editor: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  block: (prop_types_default()).any
};
/* harmony default export */ const atomics_HorizontalLine = (HorizontalLine);
;// CONCATENATED MODULE: ./renderers/block/blockRendererFn.jsx



function blockRendererFn_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function blockRendererFn_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? blockRendererFn_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : blockRendererFn_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }







var BlockRenderFnContext = /*#__PURE__*/_createClass(function BlockRenderFnContext() {
  var _this = this;
  _classCallCheck(this, BlockRenderFnContext);
  _defineProperty(this, "superProps", void 0);
  _defineProperty(this, "customBlockRendererFn", void 0);
  _defineProperty(this, "getRenderFn", function (superProps, customBlockRendererFn) {
    _this.superProps = superProps;
    _this.customBlockRendererFn = customBlockRendererFn;
    return _this.blockRendererFn;
  });
  _defineProperty(this, "renderAtomicBlock", function (props) {
    var superProps = _this.superProps;
    var entityKey = props.block.getEntityAt(0);
    if (!entityKey) {
      return null;
    }
    var entity = props.contentState.getEntity(entityKey);
    var mediaData = entity.getData();
    var mediaType = entity.getType();
    var mediaProps = blockRendererFn_objectSpread(blockRendererFn_objectSpread({}, superProps), {}, {
      block: props.block,
      mediaData: mediaData,
      entityKey: entityKey
    });
    if (mediaType === 'IMAGE') {
      return /*#__PURE__*/external_react_default().createElement(atomics_Image, mediaProps);
    }
    if (mediaType === 'AUDIO') {
      return /*#__PURE__*/external_react_default().createElement(atomics_Audio, mediaProps);
    }
    if (mediaType === 'VIDEO') {
      return /*#__PURE__*/external_react_default().createElement(atomics_Video, mediaProps);
    }
    if (mediaType === 'EMBED') {
      return /*#__PURE__*/external_react_default().createElement(atomics_Embed, mediaProps);
    }
    if (mediaType === 'HR') {
      return /*#__PURE__*/external_react_default().createElement(atomics_HorizontalLine, mediaProps);
    }
    if (superProps.extendAtomics) {
      var atomics = superProps.extendAtomics;
      for (var i = 0; i < atomics.length; i++) {
        if (mediaType === atomics[i].type) {
          var Component = atomics[i].component;
          return /*#__PURE__*/external_react_default().createElement(Component, mediaProps);
        }
      }
    }
    return null;
  });
  _defineProperty(this, "blockRendererFn", function (block) {
    var customBlockRendererFn = _this.customBlockRendererFn,
      superProps = _this.superProps;
    var blockType = block.getType();
    var blockRenderer = null;
    if (customBlockRendererFn) {
      blockRenderer = customBlockRendererFn(block, superProps) || null;
    }
    if (blockRenderer) {
      return blockRenderer;
    }
    var extensionBlockRendererFns = getExtensionBlockRendererFns(superProps.editorId);
    extensionBlockRendererFns.find(function (item) {
      if (item.blockType === blockType || item.blockType instanceof RegExp && item.blockType.test(blockType)) {
        blockRenderer = item.rendererFn ? item.rendererFn(superProps) : null;
        return true;
      }
      return false;
    });
    if (blockRenderer) {
      return blockRenderer;
    }
    if (blockType === 'atomic') {
      blockRenderer = {
        component: _this.renderAtomicBlock,
        editable: false
      };
    }
    return blockRenderer;
  });
});
var blockRenderFnContext = new BlockRenderFnContext();
/* harmony default export */ const blockRendererFn = (blockRenderFnContext.getRenderFn);
;// CONCATENATED MODULE: ./renderers/block/blockStyleFn.js
/* harmony default export */ const blockStyleFn = (function (customBlockStyleFn) {
  return function (block) {
    var blockAlignment = block.getData() && block.getData().get('textAlign');
    var blockIndent = block.getData() && block.getData().get('textIndent');
    var blockFloat = block.getData() && block.getData().get('float');
    var result = '';
    if (blockAlignment) {
      result = "bfa-".concat(blockAlignment);
    }
    if (blockIndent && blockIndent !== 0) {
      result += " bftd-".concat(blockIndent);
    }
    if (blockFloat) {
      result += " bff-".concat(blockFloat);
    }
    if (customBlockStyleFn) {
      result += customBlockStyleFn(block) || '';
    }
    return result;
  };
});
;// CONCATENATED MODULE: ./renderers/inline/inlineStyleMap.js

function inlineStyleMap_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function inlineStyleMap_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? inlineStyleMap_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : inlineStyleMap_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/* harmony default export */ const inlineStyleMap = (function (props) {
  var customStyleMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var extensionInlineStyleMap = getExtensionInlineStyleMap(props.editorId);
  return inlineStyleMap_objectSpread(inlineStyleMap_objectSpread({
    SUPERSCRIPT: {
      position: 'relative',
      top: '-8px',
      fontSize: '11px'
    },
    SUBSCRIPT: {
      position: 'relative',
      bottom: '-8px',
      fontSize: '11px'
    }
  }, extensionInlineStyleMap), customStyleMap);
});
;// CONCATENATED MODULE: ./renderers/inline/inlineStyleFn.js

var getStyleValue = function getStyleValue(style) {
  return style.split('-')[1];
};
/* harmony default export */ const inlineStyleFn = (function (props, options) {
  return function (styles, block) {
    var output = {};
    var fontFamilies = options.fontFamilies,
      unitExportFn = options.unitExportFn,
      customStyleFn = options.customStyleFn;
    var extensionInlineStyleFns = getExtensionInlineStyleFns(props.editorId);
    extensionInlineStyleFns.forEach(function (item) {
      output = item.styleFn ? item.styleFn(styles, block, output) : output;
    });
    output = customStyleFn ? customStyleFn(styles, block, output) : {};
    styles.forEach(function (style) {
      if (style.indexOf('COLOR-') === 0) {
        output.color = "#".concat(getStyleValue(style));
      } else if (style.indexOf('BGCOLOR-') === 0) {
        output.backgroundColor = "#".concat(getStyleValue(style));
      } else if (style.indexOf('FONTSIZE-') === 0) {
        output.fontSize = unitExportFn(getStyleValue(style), 'font-size', 'editor');
      } else if (style.indexOf('LINEHEIGHT-') === 0) {
        output.lineHeight = unitExportFn(getStyleValue(style), 'line-height', 'editor');
      } else if (style.indexOf('LETTERSPACING-') === 0) {
        output.letterSpacing = unitExportFn(getStyleValue(style), 'letter-spacing', 'editor');
      } else if (style.indexOf('TEXTINDENT-') === 0) {
        output.textIndent = unitExportFn(getStyleValue(style), 'text-indent', 'editor');
      } else if (style.indexOf('FONTFAMILY-') === 0) {
        output.fontFamily = (fontFamilies.find(function (item) {
          return item.name.toUpperCase() === getStyleValue(style);
        }) || {}).family || '';
      }
    });
    return output;
  };
});
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ../node_modules/@qnighy/draft-js-multidecorators/index.js
var draft_js_multidecorators = __webpack_require__(721);
var draft_js_multidecorators_default = /*#__PURE__*/__webpack_require__.n(draft_js_multidecorators);
;// CONCATENATED MODULE: ./renderers/decorators/Link/index.jsx


var viewLink = function viewLink(event, link) {
  // When pressing the Ctrl / command key, click to open the url in the link text
  if (event.getModifierState('Control') || event.getModifierState('Meta')) {
    var tempLink = document.createElement('a');
    tempLink.href = link;
    tempLink.target = event.currentTarget.target;
    tempLink.click();
  }
};
var Link = function Link(props) {
  var children = props.children,
    entityKey = props.entityKey,
    contentState = props.contentState;
  var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
    href = _contentState$getEnti.href,
    target = _contentState$getEnti.target;
  return /*#__PURE__*/external_react_default().createElement("span", {
    className: "bf-link-wrap"
  }, /*#__PURE__*/external_react_default().createElement("a", {
    onClick: function onClick(event) {
      return viewLink(event, href);
    },
    className: "bf-link",
    href: href,
    target: target
  }, children));
};
Link.propTypes = {
  children: (prop_types_default()).any,
  entityKey: (prop_types_default()).any,
  contentState: (prop_types_default()).any
};
/* harmony default export */ const decorators_Link = (Link);
;// CONCATENATED MODULE: ./renderers/decorators/index.js






var KEY_SEPARATOR = '-';
(draft_js_multidecorators_default()).prototype.getDecorations = function getDecorations(block, contentState) {
  var decorations = Array(block.getText().length).fill(null);
  this.decorators.forEach(function (decorator, i) {
    decorator.getDecorations(block, contentState).forEach(function (key, offset) {
      if (!key) {
        return;
      }
      decorations[offset] = i + KEY_SEPARATOR + key;
    });
  });
  return (0,external_immutable_.List)(decorations);
};
var builtinDecorators = [{
  type: 'entity',
  decorator: {
    key: 'LINK',
    component: decorators_Link
  }
}];
var createStrategy = function createStrategy(type) {
  return function (block, callback, contentState) {
    block.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === type;
    }, callback);
  };
};
/* harmony default export */ const decorators = (function (editorId) {
  var extensionDecorators = getExtensionDecorators(editorId);
  var entityDecorators = [].concat(builtinDecorators, _toConsumableArray(extensionDecorators.filter(function (item) {
    return item.type === 'entity';
  })));
  var strategyDecorators = extensionDecorators.filter(function (item) {
    return item.type === 'strategy';
  });
  var classDecorators = extensionDecorators.filter(function (item) {
    return item.type === 'class';
  });
  return new (draft_js_multidecorators_default())([].concat(_toConsumableArray(classDecorators.map(function (item) {
    return item.decorator;
  })), [
  // combine decorators created with strategy
  new external_draft_js_.CompositeDecorator(strategyDecorators.map(function (item) {
    return item.decorator;
  })),
  // combine decorators for entities
  new external_draft_js_.CompositeDecorator(entityDecorators.map(function (item) {
    return {
      strategy: createStrategy(item.decorator.key),
      component: item.decorator.component
    };
  }))]));
});
;// CONCATENATED MODULE: ./renderers/index.js






var getBlockRenderMap = blockRenderMap;
var getBlockRendererFn = blockRendererFn;
var getBlockStyleFn = blockStyleFn;
var getCustomStyleMap = inlineStyleMap;
var getCustomStyleFn = inlineStyleFn;
var getDecorators = decorators;
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
// EXTERNAL MODULE: external "braft-finder-2"
var external_braft_finder_2_ = __webpack_require__(121);
var external_braft_finder_2_default = /*#__PURE__*/__webpack_require__.n(external_braft_finder_2_);
;// CONCATENATED MODULE: ./languages/en.js
/* harmony default export */ const en = ({
  base: {
    remove: 'Remove',
    cancel: 'Cancel',
    confirm: 'Confirm',
    inert: 'Insert',
    width: 'Width',
    height: 'Height'
  },
  controls: {
    clear: 'Clear',
    undo: 'Undo',
    redo: 'Redo',
    fontSize: 'Font Size',
    color: 'Color',
    textColor: 'Text',
    tempColors: 'Temp Colors',
    backgroundColor: 'Background',
    bold: 'Bold',
    lineHeight: 'Line Height',
    letterSpacing: 'Letter Spacing',
    textIndent: 'Text Indent',
    increaseIndent: 'Increase Indent',
    decreaseIndent: 'Decrease Indent',
    italic: 'Italic',
    underline: 'Underline',
    strikeThrough: 'Strike Through',
    fontFamily: 'Font Family',
    textAlign: 'Text Alignment',
    alignLeft: 'Left Alignment',
    alignCenter: 'Center Alignment',
    alignRight: 'Right Alignment',
    alignJustify: 'Justify Alignment',
    floatLeft: 'Left Float',
    floatRight: 'Right Float',
    superScript: 'Super Script',
    subScript: 'Sub Script',
    removeStyles: 'Remove Styles',
    headings: 'Headings',
    header: 'Header',
    normal: 'Normal',
    orderedList: 'Ordered List',
    unorderedList: 'Unordered List',
    blockQuote: 'Quote',
    code: 'Code',
    link: 'Link',
    unlink: 'Unlink',
    hr: 'Horizontal Line',
    media: 'Media',
    mediaLibirary: 'Media Library',
    emoji: 'Emoji',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen'
  },
  linkEditor: {
    textInputPlaceHolder: 'Input link text',
    linkInputPlaceHolder: 'Input link URL',
    inputWithEnterPlaceHolder: 'Input link URL and press Enter',
    openInNewWindow: 'Open in new window',
    removeLink: 'Remove Link'
  },
  audioPlayer: {
    title: 'Play Audio'
  },
  videoPlayer: {
    title: 'Play Video',
    embedTitle: 'Embed Media'
  },
  media: {
    image: 'Image',
    video: 'Video',
    audio: 'Audio',
    embed: 'Embed'
  }
});
;// CONCATENATED MODULE: ./languages/zh.js
/* harmony default export */ const zh = ({
  base: {
    remove: '删除',
    cancel: '取消',
    confirm: '确定',
    inert: '插入',
    width: '宽度',
    height: '高度'
  },
  controls: {
    clear: '清除内容',
    undo: '撤销',
    redo: '重做',
    fontSize: '字号',
    lineHeight: '行高',
    letterSpacing: '字间距',
    textIndent: '段落缩进',
    increaseIndent: '增加缩进',
    decreaseIndent: '减少缩进',
    border: '边框',
    color: '颜色',
    textColor: '文字颜色',
    backgroundColor: '背景颜色',
    tempColors: '临时颜色',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线',
    strikeThrough: '删除线',
    fontFamily: '字体',
    textAlign: '文本对齐',
    alignLeft: '居左',
    alignCenter: '居中',
    alignRight: '居右',
    alignJustify: '两端',
    floatLeft: '左浮动',
    floatRight: '右浮动',
    superScript: '上标',
    subScript: '下标',
    removeStyles: '清除样式',
    headings: '标题',
    header: '标题',
    normal: '常规',
    orderedList: '有序列表',
    unorderedList: '无序列表',
    blockQuote: '引用',
    code: '代码',
    link: '链接',
    unlink: '清除链接',
    hr: '水平线',
    media: '媒体',
    mediaLibirary: '媒体库',
    emoji: '小表情',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏'
  },
  linkEditor: {
    textInputPlaceHolder: '输入链接文字',
    linkInputPlaceHolder: '输入链接地址',
    inputWithEnterPlaceHolder: '输入链接地址并回车',
    openInNewWindow: '在新窗口打开',
    removeLink: '移除链接'
  },
  audioPlayer: {
    title: '播放音频文件'
  },
  videoPlayer: {
    title: '播放视频文件',
    embedTitle: '嵌入式媒体'
  },
  media: {
    image: '图像',
    video: '视频',
    audio: '音频',
    embed: '嵌入式媒体'
  }
});
;// CONCATENATED MODULE: ./languages/zh-hant.js
/* harmony default export */ const zh_hant = ({
  base: {
    remove: '刪除',
    cancel: '取消',
    confirm: '確定',
    inert: '插入',
    width: '宽度',
    height: '高度'
  },
  controls: {
    clear: '清除内容',
    undo: '撤銷',
    redo: '重做',
    fontSize: '字號',
    color: '顏色',
    textColor: '文字顏色',
    backgroundColor: '背景顏色',
    tempColors: '臨時顏色',
    bold: '加粗',
    lineHeight: '行高',
    letterSpacing: '字間距',
    textIndent: '段落縮進',
    increaseIndent: '增加縮進',
    decreaseIndent: '减少縮進',
    border: '邊框',
    italic: '斜體',
    underline: '下劃線',
    strikeThrough: '刪除線',
    fontFamily: '字體',
    textAlign: '文本對齊',
    alignLeft: '居左',
    alignCenter: '居中',
    alignRight: '居右',
    alignJustify: '兩端對齊',
    floatLeft: '左浮動',
    floatRight: '右浮動',
    superScript: '上標',
    subScript: '下標',
    removeStyles: '清除样式',
    headings: '標題',
    header: '標題',
    normal: '常規',
    orderedList: '有序列表',
    unorderedList: '無序列表',
    blockQuote: '引用',
    code: '代碼',
    link: '鏈接',
    unlink: '清除鏈接',
    hr: '水平线',
    media: '媒體',
    mediaLibirary: '媒體库',
    emoji: '小表情',
    fullscreen: '全熒幕',
    exitFullscreen: '退出全熒幕'
  },
  linkEditor: {
    textInputPlaceHolder: '輸入鏈接文字',
    linkInputPlaceHolder: '輸入鏈接地址',
    inputWithEnterPlaceHolder: '輸入鏈接地址並回車',
    openInNewWindow: '在新窗口打開',
    removeLink: '移除鏈接'
  },
  audioPlayer: {
    title: '播放音頻文件'
  },
  videoPlayer: {
    title: '播放視頻文件',
    embedTitle: '嵌入式媒體'
  },
  media: {
    image: '圖像',
    video: '視頻',
    audio: '音頻',
    embed: '嵌入式媒體'
  }
});
;// CONCATENATED MODULE: ./languages/pl.js
/* harmony default export */ const pl = ({
  base: {
    remove: 'Usuń',
    cancel: 'Anuluj',
    confirm: 'Potwierdź',
    inert: 'Wstaw',
    width: 'Szerokość',
    height: 'Wysokość'
  },
  controls: {
    clear: 'Wyczyść',
    undo: 'Cofnij',
    redo: 'Przywróć',
    fontSize: 'Wielkość',
    color: 'Kolor',
    textColor: 'Kolor tekstu',
    tempColors: 'Kolory',
    backgroundColor: 'Tło',
    bold: 'Pogrubienie',
    lineHeight: 'Wysokość linii',
    letterSpacing: 'Odstęp znaków',
    textIndent: 'Wcięcie tekstu',
    increaseIndent: 'Zwiększ wcięcie',
    decreaseIndent: 'Zmniejsz wcięcie',
    italic: 'Italiki',
    underline: 'Podkreślenie',
    strikeThrough: 'Przekreślenie',
    fontFamily: 'Czcionka',
    textAlign: 'Wyrównanie tekstu',
    alignLeft: 'Do lewej',
    alignCenter: 'Wycentruj',
    alignRight: 'Do prawej',
    alignJustify: 'Wyjustuj',
    floatLeft: 'Do lewej',
    floatRight: 'Do prawej',
    superScript: 'Superskrypt',
    subScript: 'Subskrypt',
    removeStyles: 'Usuń stylowanie',
    headings: 'Nagłówki',
    header: 'Nagłówek',
    normal: 'Normalny',
    orderedList: 'Lista uporządkowana',
    unorderedList: 'Lista nieuporządkowana',
    blockQuote: 'Cytat',
    code: 'Kod',
    link: 'Link',
    unlink: 'Usuń link',
    hr: 'Linia pozioma',
    media: 'Media',
    mediaLibirary: 'Biblioteka mediów',
    emoji: 'Emoji'
  },
  linkEditor: {
    textInputPlaceHolder: 'Wpisz tekst linku',
    linkInputPlaceHolder: 'Wpisz Adres URL',
    inputWithEnterPlaceHolder: 'Wpisz adres URL i naciśnij Enter',
    openInNewWindow: 'Otwórz w nowym oknie',
    removeLink: 'Usuń link'
  },
  audioPlayer: {
    title: 'Odtwórz audio'
  },
  videoPlayer: {
    title: 'Odtwórz wideo',
    embedTitle: 'Tytuł'
  },
  media: {
    image: 'Obraz',
    video: 'Wideo',
    audio: 'Audio',
    embed: 'Obiekt osadzony'
  }
});
;// CONCATENATED MODULE: ./languages/kr.js
/* harmony default export */ const kr = ({
  base: {
    remove: '삭제',
    cancel: '취소',
    confirm: '결정',
    inert: '삽입',
    width: '너비',
    height: '높이'
  },
  controls: {
    clear: '콘텐츠지우기',
    undo: '취소',
    redo: '다시하기',
    fontSize: '글자크기',
    lineHeight: '행높이',
    letterSpacing: '단어간격',
    textIndent: '단락들여쓰기',
    increaseIndent: '들여쓰기늘리기',
    decreaseIndent: '들여쓰기줄이기',
    border: '국경',
    color: '색상',
    textColor: '텍스트색상',
    backgroundColor: '배경색상',
    tempColors: '임시색',
    bold: '굵게',
    italic: '기울임꼴',
    underline: '밑줄',
    strikeThrough: '취소선',
    fontFamily: '글꼴',
    textAlign: '텍스트정렬',
    alignLeft: '왼쪽',
    alignCenter: '중심',
    alignRight: '오른쪽',
    alignJustify: '양쪽끝',
    floatLeft: '떠다니기',
    floatRight: '오른쪽부동',
    superScript: '위첨자',
    subScript: '첨자',
    removeStyles: '스타일지우기',
    headings: '제목',
    header: '제목',
    normal: '재래식',
    orderedList: '순서가지정된목록',
    unorderedList: '정렬되지않은목록',
    blockQuote: '참고문헌',
    code: '코드',
    link: '링크',
    unlink: '링크삭제',
    hr: '수평선',
    media: '미디어',
    mediaLibirary: '미디어라이브러리',
    emoji: '작은표현',
    fullscreen: '전체화면',
    exitFullscreen: '전체화면종료'
  },
  linkEditor: {
    textInputPlaceHolder: '링크텍스트입력',
    linkInputPlaceHolder: '링크주소입력',
    inputWithEnterPlaceHolder: '링크주소입력.',
    openInNewWindow: '새창열기',
    removeLink: '링크삭제'
  },
  audioPlayer: {
    title: '오디오파일재생'
  },
  videoPlayer: {
    title: '비디오파일재생',
    embedTitle: '임베디드미디어'
  },
  media: {
    image: '이미지',
    video: '비디오',
    audio: '오디오',
    embed: '임베디드미디어'
  }
});
;// CONCATENATED MODULE: ./languages/tr.js
/* harmony default export */ const tr = ({
  base: {
    remove: 'Kaldır',
    cancel: 'İptal',
    confirm: 'Onayla',
    inert: 'Ekle',
    width: 'Genişlik',
    height: 'Yükseklik'
  },
  controls: {
    clear: 'Temizle',
    undo: 'Geri al',
    redo: 'İleri al',
    fontSize: 'Yazı boyutu',
    color: 'Renk',
    textColor: 'Yazı rengi',
    tempColors: 'Geçici renkler',
    backgroundColor: 'Arkaplan',
    bold: 'Kalın',
    lineHeight: 'Satır yüksekliği',
    letterSpacing: 'Harf aralığı',
    textIndent: 'Çentik aralığı',
    increaseIndent: 'Çentiği genişlet',
    decreaseIndent: 'Çentiği daralt',
    italic: 'Eğik',
    underline: 'Altı çizili',
    strikeThrough: 'Üstü çizili',
    fontFamily: 'Yazı tipi',
    textAlign: 'Metin Hizalama',
    alignLeft: 'Sola hizala',
    alignCenter: 'Ortaya hizala',
    alignRight: 'Sağa hizala',
    alignJustify: 'Her iki tarafa hizala',
    floatLeft: 'Sola yatır',
    floatRight: 'Sağa yatır',
    superScript: 'Ana kod',
    subScript: 'Alt kod',
    removeStyles: 'Stilleri kaldır',
    headings: 'Başlıklar',
    header: 'Başlık',
    normal: 'Normal',
    orderedList: 'Sıralı liste',
    unorderedList: 'Sırasız liste',
    blockQuote: 'Alıntı',
    code: 'Kod',
    link: 'Bağlantı',
    unlink: 'Bağlantıyı kaldır',
    hr: 'Yatay çizgi',
    media: 'Medya',
    mediaLibirary: 'Kütüphane',
    emoji: 'İfade',
    fullscreen: 'Tam ekran',
    exitFullscreen: 'Tam ekrandan çık'
  },
  linkEditor: {
    textInputPlaceHolder: 'Bağlantı metnini girin',
    linkInputPlaceHolder: "Bağlantı URL' si girin",
    inputWithEnterPlaceHolder: "Bağlantı URL'si girin ve Enter' a basın",
    openInNewWindow: 'Yeni pencerede aç',
    removeLink: 'Bağlantıyı kaldır'
  },
  audioPlayer: {
    title: 'Ses çal'
  },
  videoPlayer: {
    title: 'Görüntü oynat',
    embedTitle: 'Görüntüyü göm'
  },
  media: {
    image: 'Resim',
    video: 'Görüntü',
    audio: 'Ses',
    embed: 'Gömülü nesne'
  }
});
;// CONCATENATED MODULE: ./languages/jpn.js
/* harmony default export */ const jpn = ({
  base: {
    remove: '削除',
    cancel: 'キャンセル',
    confirm: '決定',
    inert: '挿入',
    width: '幅',
    height: '高さ'
  },
  controls: {
    clear: 'クリアコンテンツ',
    undo: 'キャンセル',
    redo: 'キャンセル',
    fontSize: 'フォントサイズ',
    lineHeight: '行の高さ',
    letterSpacing: 'ワード間隔',
    textIndent: '段落のインデント',
    increaseIndent: 'インデントを増やす',
    decreaseIndent: 'インデントを減らす',
    border: '国境',
    color: '色',
    textColor: 'テキストの色',
    backgroundColor: '背景色',
    tempColors: '仮色',
    bold: '太字',
    italic: 'イタリック体',
    underline: '下線',
    strikeThrough: '取り消し線',
    fontFamily: 'フォント',
    textAlign: 'テキストの配置',
    alignLeft: '左',
    alignCenter: '中央揃え',
    alignRight: '右に立つ',
    alignJustify: '両端',
    floatLeft: '左フローティング',
    floatRight: '右フローティング',
    superScript: '上付き',
    subScript: '下付き文字',
    removeStyles: 'クリアスタイル',
    headings: '役職',
    header: '役職',
    normal: '従来の',
    orderedList: '順序付きリスト',
    unorderedList: '番号なしリスト',
    blockQuote: '参照',
    code: 'コード',
    link: 'リンク',
    unlink: 'リンクを解除',
    hr: '横線',
    media: 'メディア',
    mediaLibirary: 'メディアライブラリー',
    emoji: '小さな表現',
    fullscreen: '全画面',
    exitFullscreen: '全画面を退く'
  },
  linkEditor: {
    textInputPlaceHolder: 'リンクテキストを入力',
    linkInputPlaceHolder: 'リンクアドレスを入力',
    inputWithEnterPlaceHolder: 'リンクアドレスを入力して戻ります',
    openInNewWindow: '新しいウィンドウで開く',
    removeLink: '新しいウィンドウで開く'
  },
  audioPlayer: {
    title: 'オーディオファイルを再生する'
  },
  videoPlayer: {
    title: 'ビデオファイルを再生する',
    embedTitle: '埋め込みメディア'
  },
  media: {
    image: '画像',
    video: 'ビデオ',
    audio: '音声',
    embed: '埋め込みメディア'
  }
});
;// CONCATENATED MODULE: ./languages/ru.js
/* harmony default export */ const ru = ({
  base: {
    remove: 'Удалить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    insert: 'Вставить',
    width: 'Ширина',
    height: 'Высота'
  },
  controls: {
    clear: 'Очистить',
    undo: 'Отменить',
    redo: 'Повторить',
    fontSize: 'Размер шрифта',
    color: 'Цвет',
    textColor: 'Цвет текста',
    tempColors: 'Temp Colors',
    backgroundColor: 'Цвет фона',
    bold: 'Жирный',
    lineHeight: 'Межстрочный интервал',
    letterSpacing: 'Межбуквенный интервал',
    textIndent: 'Отступ',
    increaseIndent: 'Увеличить отступ',
    decreaseIndent: 'Уменьшить отступ',
    italic: 'Курсив',
    underline: 'Подчеркнутый',
    strikeThrough: 'Перечеркнутый',
    fontFamily: 'Шрифт',
    textAlign: 'Расположение текста',
    alignLeft: 'По левому краю',
    alignCenter: 'По центру',
    alignRight: 'По правому краю',
    alignJustify: 'По ширине',
    floatLeft: 'Обтекание слева',
    floatRight: 'Обтекание справа',
    superScript: 'Надстрочный индекс',
    subScript: 'Подстрочный индекс',
    removeStyles: 'Убрать стили',
    headings: 'Заголовки',
    header: 'Заголовок',
    normal: 'Обычный',
    orderedList: 'Упорядоченный список',
    unorderedList: 'Неупорядоченный список',
    blockQuote: 'Цитата',
    code: 'Код',
    link: 'Вставить ссылку',
    unlink: 'Убрать ссылку',
    hr: 'Горизонтальная линия',
    media: 'Медиа',
    mediaLibirary: 'Медиа библиотека',
    emoji: 'Emoji',
    fullscreen: 'Полноэкранный режим',
    exitFullscreen: 'Выйти из полноэкранного режима'
  },
  linkEditor: {
    textInputPlaceHolder: 'Введите текст ссылки',
    linkInputPlaceHolder: 'Вставить ссылку',
    inputWithEnterPlaceHolder: 'Вставить ссылку и нажать Enter',
    openInNewWindow: 'Открыть в новом окне',
    removeLink: 'Убрать ссылку'
  },
  audioPlayer: {
    title: 'Воспроизвести аудиофайл'
  },
  videoPlayer: {
    title: 'Воспроизвести видеофайл',
    embedTitle: 'Embed Media'
  },
  media: {
    image: 'Картинка',
    video: 'Видео',
    audio: 'Аудио',
    embed: 'Встроенное'
  }
});
;// CONCATENATED MODULE: ./languages/fr.js
/* harmony default export */ const fr = ({
  base: {
    remove: 'Supprimer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    inert: 'Insérer',
    width: 'Largeur',
    height: 'Hauteur'
  },
  controls: {
    clear: 'Effacer',
    undo: 'Annuler',
    redo: 'Refaire',
    fontSize: 'Taille de police',
    color: 'Couleur',
    textColor: 'Texte',
    tempColors: 'Couleurs temporaire',
    backgroundColor: "Couleur d'arrière plan",
    bold: 'Gras',
    lineHeight: 'Hauteur de ligne',
    letterSpacing: 'Espacement des lettres',
    textIndent: 'Indentation du texte',
    increaseIndent: "Augmenter l'indentation",
    decreaseIndent: "Réduire l'indentation",
    italic: 'Italique',
    underline: 'Souligner',
    strikeThrough: 'Barrer',
    fontFamily: "Police d'écriture",
    textAlign: 'Alignement du texte',
    alignLeft: 'Aligner à gauche',
    alignCenter: 'Aligner au centre',
    alignRight: 'Aligner à droite',
    alignJustify: 'Justifier',
    floatLeft: 'Déplacer à gauche',
    floatRight: 'Déplacer à droite',
    superScript: 'Super-script',
    subScript: 'Sous-script',
    removeStyles: 'Supprimer les styles',
    headings: 'Titres',
    header: 'Entêtes',
    normal: 'Normal',
    orderedList: 'Liste ordonnée',
    unorderedList: 'Liste non-ordonnée',
    blockQuote: 'Citation',
    code: 'Code',
    link: 'Insérer un lien',
    unlink: 'Supprimer le lien',
    hr: 'Ligne horizontale',
    media: 'Média',
    mediaLibirary: 'Bibliothêque',
    emoji: 'Emoji',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran'
  },
  linkEditor: {
    textInputPlaceHolder: 'Insérer le texte à afficher',
    linkInputPlaceHolder: 'Insérer le lien URL',
    inputWithEnterPlaceHolder: 'Insérer le lien URL puis appuyer sur Entrée',
    openInNewWindow: 'Ouvrir dans une nouvelle fenêtre',
    removeLink: 'Supprimer le lien'
  },
  audioPlayer: {
    title: 'Lancer le son audio'
  },
  videoPlayer: {
    title: 'Lancer la video',
    embedTitle: 'Intégrer média'
  },
  media: {
    image: 'Image',
    video: 'Vidéo',
    audio: 'Audio',
    embed: 'Intégré'
  }
});
;// CONCATENATED MODULE: ./languages/pt-br.js
/* harmony default export */ const pt_br = ({
  base: {
    remove: 'Remover',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    inert: 'Inserir',
    width: 'Largura',
    height: 'Altura'
  },
  controls: {
    clear: 'Limpar',
    undo: 'Desfazer',
    redo: 'Refazer',
    fontSize: 'Tamanho da Fonte',
    color: 'Cor',
    textColor: 'Texto',
    tempColors: 'Temp Colors',
    backgroundColor: 'Cor de Fundo',
    bold: 'Negrito',
    lineHeight: 'Altura da Linha',
    letterSpacing: 'Espaçamento entre Letras',
    textIndent: 'Identação de Texto',
    increaseIndent: 'Aumentar Identação',
    decreaseIndent: 'Diminuir Identção',
    italic: 'Itálico',
    underline: 'Sublinhado',
    strikeThrough: 'Riscado',
    fontFamily: 'Família da Fonte',
    textAlign: 'Alinhamento de Texto',
    alignLeft: 'Alinhamento à Esquerda',
    alignCenter: 'Alinhamento Centralizado',
    alignRight: 'Alinhamento à Direita',
    alignJustify: 'Alinhamento Justificado',
    floatLeft: 'Flutuação à Esquerda',
    floatRight: 'Flutuação à Direita',
    superScript: 'Sobrescrito',
    subScript: 'Subscrito',
    removeStyles: 'Remover Estilos',
    headings: 'Cabeçalhos',
    header: 'Cabeçalho',
    normal: 'Normal',
    orderedList: 'Lista Ordenada',
    unorderedList: 'Lista Não Ordenada',
    blockQuote: 'Citação',
    code: 'Código',
    link: 'Link',
    unlink: 'Remover Link',
    hr: 'Separador Horizontal',
    media: 'Mídia',
    mediaLibirary: 'Biblioteca de Mídia',
    emoji: 'Emoji',
    fullscreen: 'Tela Cheia',
    exitFullscreen: 'Sair de Tela Cheia'
  },
  linkEditor: {
    textInputPlaceHolder: 'Insira o texto do link',
    linkInputPlaceHolder: 'Insira a URL do link',
    inputWithEnterPlaceHolder: 'Insira a URL do link e aperte Enter',
    openInNewWindow: 'Abrir em nova janela',
    removeLink: 'Remover Link'
  },
  audioPlayer: {
    title: 'Reproduzir Áudio'
  },
  videoPlayer: {
    title: 'Reproduzir Vídeo',
    embedTitle: 'Mídia Incorporada'
  },
  media: {
    image: 'Imagem',
    video: 'Vídeo',
    audio: 'Áudio',
    embed: 'Mídia Incorporada'
  }
});
;// CONCATENATED MODULE: ./languages/vi-vn.js
/* harmony default export */ const vi_vn = ({
  base: {
    remove: 'Xóa bỏ',
    cancel: 'Hủy bỏ',
    confirm: 'Xác nhận',
    inert: 'Chèn vào',
    width: 'Độ rộng',
    height: 'Độ cao'
  },
  controls: {
    clear: 'Xóa toàn bộ nội dung',
    undo: 'Hủy bỏ',
    redo: 'Làm lại',
    fontSize: 'Size chữ',
    lineHeight: 'Độ cao hàng',
    letterSpacing: 'Khoảng cách chữ',
    textIndent: 'Khoảng cách đoạn văn',
    increaseIndent: 'Tăng khoảng cách',
    decreaseIndent: 'Giảm khoảng cách',
    border: 'Đường viền',
    color: 'Màu sắc',
    textColor: 'Màu chữ',
    backgroundColor: 'Màu nền',
    tempColors: 'Màu tạm thời',
    bold: 'Tô đậm',
    italic: 'In nghiêng',
    underline: 'Gạch dưới',
    strikeThrough: 'Xóa gạch dưới',
    fontFamily: 'Font chữ',
    textAlign: 'Căn chỉnh văn bản',
    alignLeft: 'Căn trái',
    alignCenter: 'Căn giữa',
    alignRight: 'Căn phải',
    alignJustify: 'Hai lề',
    floatLeft: 'Float left',
    floatRight: 'Float right',
    superScript: 'Chỉ số trên',
    subScript: 'Chỉ số dưới',
    removeStyles: 'Xóa style',
    headings: 'Tiêu đề',
    header: 'Tiêu đề',
    normal: 'Quy tắc thông thường',
    orderedList: 'Kiểu sắp xếp',
    unorderedList: 'Kiểu không sắp xếp',
    blockQuote: 'Trích dẫn',
    code: 'Code',
    link: 'Liên kết',
    unlink: 'Gỡ liên kết',
    hr: 'Horizontal line',
    media: 'Media',
    mediaLibirary: 'Kho media',
    emoji: 'Biểu tượng cảm xúc',
    fullscreen: 'Toàn màn hình',
    exitFullscreen: 'Thoát khỏi chế độ toàn màn hình'
  },
  linkEditor: {
    textInputPlaceHolder: 'Nhập văn bản liên kết',
    linkInputPlaceHolder: 'Nhập địa chỉ liên kết',
    inputWithEnterPlaceHolder: 'Nhập địa chỉ liên kết và Enter',
    openInNewWindow: 'Mở trong tab mới',
    removeLink: 'Gỡ liên kết'
  },
  audioPlayer: {
    title: 'Phát tệp âm thanh'
  },
  videoPlayer: {
    title: 'Phát tệp video',
    embedTitle: 'Media nhúng'
  },
  media: {
    image: 'Hình ảnh',
    video: 'Video',
    audio: 'Âm thanh',
    embed: 'Media nhúng'
  }
});
;// CONCATENATED MODULE: ./languages/index.js











/* harmony default export */ const languages = ({
  en: en,
  zh: zh,
  'zh-hant': zh_hant,
  pl: pl,
  kr: kr,
  tr: tr,
  jpn: jpn,
  ru: ru,
  fr: fr,
  'pt-br': pt_br,
  'vi-vn': vi_vn
});
;// CONCATENATED MODULE: ./configs/keybindings.js


// TODO
// Allow custom shortcut settings

/* harmony default export */ const keybindings = (function (customKeyBindingFn) {
  return function (event) {
    if (event.keyCode === 83 && (external_draft_js_.KeyBindingUtil.hasCommandModifier(event) || external_draft_js_.KeyBindingUtil.isCtrlKeyCommand(event))) {
      return 'braft-save';
    }
    if (customKeyBindingFn) {
      return customKeyBindingFn(event) || (0,external_draft_js_.getDefaultKeyBinding)(event);
    }
    return (0,external_draft_js_.getDefaultKeyBinding)(event);
  };
});
;// CONCATENATED MODULE: ./configs/props.js
/* harmony default export */ const configs_props = ({
  language: 'en',
  controls: ['undo', 'redo', 'separator', 'font-size', 'line-height', 'letter-spacing', 'separator', 'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator', 'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator', 'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator', 'media', 'link', 'table', 'split', 'hr', 'separator', 'clear', 'separator', 'fullscreen'],
  excludeControls: [],
  extendControls: [],
  extendAtomics: [],
  componentBelowControlBar: null,
  media: {
    pasteImage: true,
    imagePasteLimit: 5,
    image: true,
    video: true,
    audio: true,
    uploadFn: null,
    validateFn: null,
    onBeforeDeselect: null,
    onDeselect: null,
    onBeforeSelect: null,
    onSelect: null,
    onBeforeRemove: null,
    onRemove: null,
    onCancel: null,
    onFileSelect: null,
    onBeforeInsert: null,
    onInsert: null,
    onChange: null,
    accepts: {
      image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
      video: 'video/mp4',
      audio: 'audio/mp3'
    },
    externals: {
      audio: true,
      video: true,
      image: true,
      embed: true
    }
  },
  imageControls: ['float-left', 'float-right', 'align-left', 'align-center', 'align-right', 'link', 'size', 'remove'],
  imageResizable: true,
  imageEqualRatio: true,
  colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff', '#61a951', '#16a085', '#07a9fe', '#003ba5', '#8e44ad', '#f32784', '#c0392b', '#d35400', '#f39c12', '#fdda00'],
  colorPicker: null,
  colorPickerTheme: 'dark',
  colorPickerAutoHide: true,
  codeTabIndents: 2,
  headings: ['header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six', 'unstyled'],
  textAligns: ['left', 'center', 'right', 'justify'],
  textBackgroundColor: true,
  allowInsertLinkText: false,
  defaultLinkTarget: '',
  letterSpacings: [0, 1, 2, 3, 4, 5, 6],
  lineHeights: [1, 1.2, 1.5, 1.75, 2, 2.5, 3, 4],
  fontSizes: [12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 48, 56, 64, 72, 96, 120, 144],
  fontFamilies: [{
    name: 'Araial',
    family: 'Arial, Helvetica, sans-serif'
  }, {
    name: 'Georgia',
    family: 'Georgia, serif'
  }, {
    name: 'Impact',
    family: 'Impact, serif'
  }, {
    name: 'Monospace',
    family: '"Courier New", Courier, monospace'
  }, {
    name: 'Tahoma',
    family: 'tahoma, arial, "Hiragino Sans GB", 宋体, sans-serif'
  }],
  converts: {
    unitExportFn: function unitExportFn(value, type) {
      return type === 'line-height' ? value : "".concat(value, "px");
    }
  },
  emojis: ['🤣', '🙌', '💚', '💛', '👏', '😉', '💯', '💕', '💞', '💘', '💙', '💝', '🖤', '💜', '❤️', '😍', '😻', '💓', '💗', '😋', '😇', '😂', '😹', '😘', '💖', '😁', '😀', '🤞', '😲', '😄', '😊', '👍', '😌', '😃', '😅', '✌️', '🤗', '💋', '😗', '😽', '😚', '🤠', '😙', '😺', '👄', '😸', '😏', '😼', '👌', '😎', '😆', '😛', '🙏', '🤝', '🙂', '🤑', '😝', '😐', '😑', '🤤', '😤', '🙃', '🤡', '😶', '😪', '😴', '😵', '😓', '👊', '😦', '😷', '🤐', '😜', '🤓', '👻', '😥', '🙄', '🤔', '🤒', '🙁', '😔', '😯', '☹️', '☠️', '😰', '😩', '😖', '😕', '😒', '😣', '😢', '😮', '😿', '🤧', '😫', '🤥', '😞', '😬', '👎', '💀', '😳', '😨', '🤕', '🤢', '😱', '😭', '😠', '😈', '😧', '💔', '😟', '🙀', '💩', '👿', '😡', '😾', '🖕'],
  stripPastedStyles: false,
  triggerChangeOnMount: true,
  className: '',
  style: {},
  controlBarClassName: '',
  controlBarStyle: {},
  contentClassName: '',
  contentStyle: {},
  draftProps: {},
  hooks: {},
  onChange: null,
  onFocus: null,
  onBlur: null,
  onTab: null,
  onDelete: null,
  onSave: null,
  fixPlaceholder: false
});
// EXTERNAL MODULE: ../node_modules/draft-js/lib/getFragmentFromSelection.js
var getFragmentFromSelection = __webpack_require__(295);
var getFragmentFromSelection_default = /*#__PURE__*/__webpack_require__.n(getFragmentFromSelection);
// EXTERNAL MODULE: external "draftjs-utils"
var external_draftjs_utils_ = __webpack_require__(703);
;// CONCATENATED MODULE: ./configs/handlers.js


function handlers_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function handlers_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? handlers_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : handlers_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/* eslint-disable no-underscore-dangle */




var keyCommandHandlers = function keyCommandHandlers(command, editorState, editor) {
  if (editor.editorProps.handleKeyCommand && editor.editorProps.handleKeyCommand(command, editorState, editor) === 'handled') {
    return 'handled';
  }
  if (command === 'braft-save') {
    if (editor.editorProps.onSave) {
      editor.editorProps.onSave(editorState);
    }
    return 'handled';
  }
  var _editor$editorProps = editor.editorProps,
    controls = _editor$editorProps.controls,
    excludeControls = _editor$editorProps.excludeControls;
  var allowIndent = (controls.indexOf('text-indent') !== 0 || controls.find(function (item) {
    return item.key === 'text-indent';
  })) && excludeControls.indexOf('text-indent') === -1;
  var cursorStart = editorState.getSelection().getStartOffset();
  var cursorEnd = editorState.getSelection().getEndOffset();
  var cursorIsAtFirst = cursorStart === 0 && cursorEnd === 0;
  if (command === 'backspace') {
    if (editor.editorProps.onDelete && editor.editorProps.onDelete(editorState) === false) {
      return 'handled';
    }
    var blockType = external_braft_utils_2_.ContentUtils.getSelectionBlockType(editorState);
    if (allowIndent && cursorIsAtFirst && blockType !== 'code-block') {
      editor.setValue(external_braft_utils_2_.ContentUtils.decreaseSelectionIndent(editorState));
    }
  }
  if (command === 'tab') {
    var _blockType = external_braft_utils_2_.ContentUtils.getSelectionBlockType(editorState);
    if (_blockType === 'code-block') {
      editor.setValue(external_braft_utils_2_.ContentUtils.insertText(editorState, ' '.repeat(editor.editorProps.codeTabIndents)));
      return 'handled';
    }
    if (_blockType === 'ordered-list-item' || _blockType === 'unordered-list-item') {
      var newEditorState = external_draft_js_.RichUtils.onTab(event, editorState, 4);
      if (newEditorState !== editorState) {
        editor.setValue(newEditorState);
      }
      return 'handled';
    }
    if (_blockType !== 'atomic' && allowIndent && cursorIsAtFirst) {
      editor.setValue(external_braft_utils_2_.ContentUtils.increaseSelectionIndent(editorState));
      return 'handled';
    }
  }
  var nextEditorState = external_braft_utils_2_.ContentUtils.handleKeyCommand(editorState, command);
  if (nextEditorState) {
    editor.setValue(nextEditorState);
    return 'handled';
  }
  return 'not-handled';
};
var returnHandlers = function returnHandlers(event, editorState, editor) {
  if (editor.editorProps.handleReturn && editor.editorProps.handleReturn(event, editorState, editor) === 'handled') {
    return 'handled';
  }
  var currentBlock = external_braft_utils_2_.ContentUtils.getSelectionBlock(editorState);
  var currentBlockType = currentBlock.getType();
  if (currentBlockType === 'unordered-list-item' || currentBlockType === 'ordered-list-item') {
    if (currentBlock.getLength() === 0) {
      editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionBlockType(editorState, 'unstyled'));
      return 'handled';
    }
    return 'not-handled';
  }
  if (currentBlockType === 'code-block') {
    if (event.which === 13 && (event.getModifierState('Shift') || event.getModifierState('Alt') || event.getModifierState('Control'))) {
      editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionBlockType(editorState, 'unstyled'));
      return 'handled';
    }
    return 'not-handled';
  }
  if (currentBlockType === 'blockquote') {
    if (event.which === 13) {
      if (event.getModifierState('Shift') || event.getModifierState('Alt') || event.getModifierState('Control')) {
        // eslint-disable-next-line no-param-reassign
        event.which = 0;
      } else {
        editor.setValue(external_draft_js_.RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }
    }
  }
  var nextEditorState = (0,external_draftjs_utils_.handleNewLine)(editorState, event);
  if (nextEditorState) {
    editor.setValue(nextEditorState);
    return 'handled';
  }
  return 'not-handled';
};
var beforeInputHandlers = function beforeInputHandlers(chars, editorState, editor) {
  if (editor.editorProps.handleBeforeInput && editor.editorProps.handleBeforeInput(chars, editorState, editor) === 'handled') {
    return 'handled';
  }
  return 'not-handled';
};
var compositionStartHandler = function compositionStartHandler(_, editor) {
  var editorState = editor.state.editorState;
  var selectedBlocks = external_braft_utils_2_.ContentUtils.getSelectedBlocks(editorState);
  if (selectedBlocks && selectedBlocks.length > 1) {
    var nextEditorState = external_draft_js_.EditorState.push(editorState, external_draft_js_.Modifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), 'backward'), 'remove-range');
    editor.setValue(nextEditorState);
  }
};
var dropHandlers = function dropHandlers(selectionState, dataTransfer, editor) {
  if (editor.editorProps.readOnly || editor.editorProps.disabled) {
    return 'handled';
  }
  if (window && window.__BRAFT_DRAGING__IMAGE__) {
    var nextEditorState = external_draft_js_.EditorState.forceSelection(editor.state.editorState, selectionState);
    nextEditorState = external_braft_utils_2_.ContentUtils.insertMedias(nextEditorState, [window.__BRAFT_DRAGING__IMAGE__.mediaData]);
    nextEditorState = external_braft_utils_2_.ContentUtils.removeBlock(nextEditorState, window.__BRAFT_DRAGING__IMAGE__.block, nextEditorState.getSelection());
    window.__BRAFT_DRAGING__IMAGE__ = null;
    editor.lockOrUnlockEditor(true);
    editor.setValue(nextEditorState);
    return 'handled';
  }
  if (!dataTransfer || !dataTransfer.getText()) {
    return 'handled';
  }
  return 'not-handled';
};
var handleFiles = function handleFiles(files, editor) {
  var _editor$constructor$d = handlers_objectSpread(handlers_objectSpread({}, editor.constructor.defaultProps.media), editor.editorProps.media),
    pasteImage = _editor$constructor$d.pasteImage,
    validateFn = _editor$constructor$d.validateFn,
    imagePasteLimit = _editor$constructor$d.imagePasteLimit;
  if (pasteImage) {
    files.slice(0, imagePasteLimit).forEach(function (file) {
      if (file && file.type.indexOf('image') > -1 && editor.braftFinder) {
        var validateResult = validateFn ? validateFn(file) : true;
        if (validateResult instanceof Promise) {
          validateResult.then(function () {
            editor.braftFinder.uploadImage(file, function (image) {
              if (editor.isLiving) {
                editor.setValue(external_braft_utils_2_.ContentUtils.insertMedias(editor.state.editorState, [image]));
              }
            });
          });
        } else if (validateResult) {
          editor.braftFinder.uploadImage(file, function (image) {
            if (editor.isLiving) {
              editor.setValue(external_braft_utils_2_.ContentUtils.insertMedias(editor.state.editorState, [image]));
            }
          });
        }
      }
    });
  }
  if (files[0] && files[0].type.indexOf('image') > -1 && pasteImage) {
    return 'handled';
  }
  return 'not-handled';
};
var droppedFilesHandlers = function droppedFilesHandlers(selectionState, files, editor) {
  if (editor.editorProps.handleDroppedFiles && editor.editorProps.handleDroppedFiles(selectionState, files, editor) === 'handled') {
    return 'handled';
  }
  return handleFiles(files, editor);
};
var pastedFilesHandlers = function pastedFilesHandlers(files, editor) {
  if (editor.editorProps.handlePastedFiles && editor.editorProps.handlePastedFiles(files, editor) === 'handled') {
    return 'handled';
  }
  return handleFiles(files, editor);
};
var copyHandlers = function copyHandlers(event, editor) {
  var blockMap = getFragmentFromSelection_default()(editor.state.editorState);
  if (blockMap && blockMap.toArray) {
    try {
      var tempContentState = external_draft_js_.ContentState.createFromBlockArray(blockMap.toArray());
      var tempEditorState = external_draft_js_.EditorState.createWithContent(tempContentState);
      var clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
      tempEditorState.setConvertOptions(editor.state.editorState.convertOptions);
      clipboardData.setData('text/html', tempEditorState.toHTML());
      clipboardData.setData('text/plain', tempEditorState.toText());
      event.preventDefault();
    } catch (error) {
      console.warn(error);
    }
  }
};
var pastedTextHandlers = function pastedTextHandlers(text, html, editorState, editor) {
  if (editor.editorProps.handlePastedText && editor.editorProps.handlePastedText(text, html, editorState, editor) === 'handled') {
    return 'handled';
  }
  if (!html || editor.editorProps.stripPastedStyles) {
    return false;
  }
  var tempColors = external_braft_utils_2_.ColorUtils.detectColorsFromHTMLString(html);
  editor.setState({
    tempColors: [].concat(_toConsumableArray(editor.state.tempColors), _toConsumableArray(tempColors)).filter(function (item) {
      return editor.editorProps.colors.indexOf(item) === -1;
    }).filter(function (item, index, array) {
      return array.indexOf(item) === index;
    })
  }, function () {
    editor.setValue(external_braft_utils_2_.ContentUtils.insertHTML(editorState, html, 'paste'));
  });
  return 'handled';
};
;// CONCATENATED MODULE: ./helpers/responsive.js

/* eslint-disable new-cap */

var resizeEventHandlers = [];
var responsiveHelperInited = false;
var debouce = false;
/* harmony default export */ const responsive = ({
  resolve: function resolve(eventHandler) {
    var id = external_braft_utils_2_.BaseUtils.UniqueIndex();
    resizeEventHandlers.push({
      id: id,
      eventHandler: eventHandler
    });
    return id;
  },
  unresolve: function unresolve(id) {
    resizeEventHandlers = resizeEventHandlers.filter(function (item) {
      return item.id !== id;
    });
  }
});
if (!responsiveHelperInited && (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
  window.addEventListener('resize', function (event) {
    clearTimeout(debouce);
    debouce = setTimeout(function () {
      resizeEventHandlers.map(function (item) {
        if (typeof item.eventHandler === 'function') {
          item.eventHandler(event);
          return true;
        }
        return false;
      });
      debouce = false;
    }, 100);
  });
  responsiveHelperInited = true;
}
;// CONCATENATED MODULE: ./components/common/DropDown/index.jsx







function DropDown_createSuper(Derived) { var hasNativeReflectConstruct = DropDown_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function DropDown_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/* eslint-disable react/no-danger */





var DropDown = /*#__PURE__*/function (_React$Component) {
  _inherits(DropDown, _React$Component);
  var _super = DropDown_createSuper(DropDown);
  function DropDown() {
    var _this;
    _classCallCheck(this, DropDown);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "state", {
      active: false,
      disabled: false,
      offset: 0
    });
    _defineProperty(_assertThisInitialized(_this), "responsiveResolveId", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "dropDownHandlerElement", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "dropDownContentElement", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "fixDropDownPosition", function () {
      var viewRect = _this.props.getContainerNode().getBoundingClientRect();
      var handlerRect = _this.dropDownHandlerElement.current.getBoundingClientRect();
      var contentRect = _this.dropDownContentElement.current.getBoundingClientRect();
      var offset = 0;
      var right = handlerRect.right - handlerRect.width / 2 + contentRect.width / 2;
      var left = handlerRect.left + handlerRect.width / 2 - contentRect.width / 2;
      right = viewRect.right - right;
      left -= viewRect.left;
      if (right < 10) {
        offset = right - 10;
      } else if (left < 10) {
        offset = left * -1 + 10;
      }
      if (offset !== _this.state.offset) {
        _this.setState({
          offset: offset
        });
      }
    });
    _defineProperty(_assertThisInitialized(_this), "registerClickEvent", function (event) {
      var autoHide = _this.props.autoHide;
      var active = _this.state.active;
      if (_this.dropDownContentElement.current.contains(event.target) || _this.dropDownHandlerElement.current.contains(event.target)) {
        return false;
      }
      if (autoHide && active) {
        _this.hide();
      }
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "toggle", function () {
      _this.setState(function (prevState) {
        return {
          active: !prevState.active
        };
      });
    });
    _defineProperty(_assertThisInitialized(_this), "show", function () {
      _this.setState({
        active: true
      });
    });
    _defineProperty(_assertThisInitialized(_this), "hide", function () {
      _this.setState({
        active: false
      });
    });
    return _this;
  }
  _createClass(DropDown, [{
    key: "componentDidMount",
    value:
    // eslint-disable-next-line react/sort-comp
    function componentDidMount() {
      if (document) {
        document.body.addEventListener('click', this.registerClickEvent);
        this.responsiveResolveId = responsive.resolve(this.fixDropDownPosition);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (!prevState.active && this.state.active) {
        this.fixDropDownPosition();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (document) {
        document.body.removeEventListener('click', this.registerClickEvent);
        responsive.unresolve(this.responsiveResolveId);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
        active = _this$state.active,
        offset = _this$state.offset;
      var _this$props = this.props,
        caption = _this$props.caption,
        htmlCaption = _this$props.htmlCaption,
        title = _this$props.title,
        disabled = _this$props.disabled,
        showArrow = _this$props.showArrow,
        arrowActive = _this$props.arrowActive,
        className = _this$props.className,
        children = _this$props.children;
      return /*#__PURE__*/external_react_default().createElement("div", {
        className: dist_mergeClassNames('bf-dropdown', !disabled && active && 'active', disabled && 'disabled', className)
      }, htmlCaption ? /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        className: "dropdown-handler",
        "data-title": title,
        "aria-label": "Button",
        onClick: this.toggle,
        dangerouslySetInnerHTML: htmlCaption ? {
          __html: htmlCaption
        } : null,
        ref: this.dropDownHandlerElement
      }) : /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        className: "dropdown-handler",
        "data-title": title,
        onClick: this.toggle,
        ref: this.dropDownHandlerElement
      }, /*#__PURE__*/external_react_default().createElement("span", null, caption), showArrow !== false ? /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-drop-down"
      }) : null), /*#__PURE__*/external_react_default().createElement("div", {
        className: "dropdown-content",
        style: {
          marginLeft: offset
        },
        ref: this.dropDownContentElement
      }, /*#__PURE__*/external_react_default().createElement("i", {
        style: {
          marginLeft: offset * -1
        },
        className: dist_mergeClassNames('dropdown-arrow', arrowActive && 'active')
      }), /*#__PURE__*/external_react_default().createElement("div", {
        className: "dropdown-content-inner"
      }, children)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (!prevState.disabled && nextProps !== null && nextProps !== void 0 && nextProps.disabled) {
        return {
          active: false,
          disabled: true
        };
      }
      return null;
    }
  }]);
  return DropDown;
}((external_react_default()).Component);
DropDown.propTypes = {
  autoHide: (prop_types_default()).any,
  onChange: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  caption: (prop_types_default()).any,
  htmlCaption: (prop_types_default()).any,
  title: (prop_types_default()).any,
  disabled: (prop_types_default()).any,
  showArrow: (prop_types_default()).any,
  arrowActive: (prop_types_default()).any,
  className: (prop_types_default()).any,
  children: (prop_types_default()).any,
  theme: (prop_types_default()).any
};
/* harmony default export */ const common_DropDown = (DropDown);
;// CONCATENATED MODULE: ./components/business/ControlGroup/index.jsx


var ControlGroup = function ControlGroup(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "control-item-group"
  }, children);
};
ControlGroup.propTypes = {
  children: (prop_types_default()).any
};
/* harmony default export */ const business_ControlGroup = (ControlGroup);
;// CONCATENATED MODULE: ./components/business/LinkEditor/index.jsx









var _excluded = ["children"],
  _excluded2 = ["children"];
function LinkEditor_createSuper(Derived) { var hasNativeReflectConstruct = LinkEditor_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function LinkEditor_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */







var generateNewObj = function generateNewObj(props) {
  var cache = [];
  var json_str = JSON.stringify(props, function (key, value) {
    if (_typeof(value) === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  });
  cache = null;
  return json_str;
};
var LinkEditor = /*#__PURE__*/function (_React$Component) {
  _inherits(LinkEditor, _React$Component);
  var _super = LinkEditor_createSuper(LinkEditor);
  function LinkEditor(props) {
    var _this;
    _classCallCheck(this, LinkEditor);
    var _ref = props || {},
      children = _ref.children,
      attrProps = _objectWithoutProperties(_ref, _excluded);
    console.log(attrProps);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "dropDownInstance", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "handeKeyDown", function (e) {
      if (e.keyCode === 13) {
        _this.handleConfirm();
        e.preventDefault();
        return false;
      }
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "handleTnputText", function (e) {
      _this.setState({
        text: e.currentTarget.value
      });
    });
    _defineProperty(_assertThisInitialized(_this), "handleInputLink", function (e) {
      _this.setState({
        href: e.currentTarget.value
      });
    });
    _defineProperty(_assertThisInitialized(_this), "setTarget", function () {
      _this.setState(function (prevState) {
        return {
          target: prevState.target === '_blank' ? '' : '_blank'
        };
      });
    });
    _defineProperty(_assertThisInitialized(_this), "handleCancel", function () {
      _this.dropDownInstance.current.hide();
    });
    _defineProperty(_assertThisInitialized(_this), "handleUnlink", function () {
      _this.dropDownInstance.current.hide();
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionLink(_this.props.editorState, false));
    });
    _defineProperty(_assertThisInitialized(_this), "handleConfirm", function () {
      var _this$state = _this.state,
        href = _this$state.href,
        target = _this$state.target;
      var _this$state2 = _this.state,
        text = _this$state2.text,
        textSelected = _this$state2.textSelected;
      var hookReturns = _this.props.hooks('toggle-link', {
        href: href,
        target: target
      })({
        href: href,
        target: target
      });
      _this.dropDownInstance.current.hide();
      _this.props.editor.requestFocus();
      if (hookReturns === false) {
        return false;
      }
      if (hookReturns) {
        if (typeof hookReturns.href === 'string') {
          href = hookReturns.href;
        }
        if (typeof hookReturns.target === 'string') {
          target = hookReturns.target;
        }
      }
      if (textSelected) {
        if (href) {
          _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionLink(_this.props.editorState, href, target));
        } else {
          _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionLink(_this.props.editorState, false));
        }
      } else {
        _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.insertText(_this.props.editorState, text || href, null, {
          type: 'LINK',
          data: {
            href: href,
            target: target
          }
        }));
      }
      return true;
    });
    _this.state = {
      text: '',
      href: '',
      target: props.defaultLinkTarget || '',
      textSelected: false,
      propsStr: generateNewObj(attrProps)
    };
    return _this;
  }
  _createClass(LinkEditor, [{
    key: "render",
    value: function render() {
      var allowInsertLinkText = this.props.allowInsertLinkText;
      var _this$state3 = this.state,
        text = _this$state3.text,
        href = _this$state3.href,
        target = _this$state3.target,
        textSelected = _this$state3.textSelected;
      var caption = /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-link"
      });
      return /*#__PURE__*/external_react_default().createElement(business_ControlGroup, null, /*#__PURE__*/external_react_default().createElement(common_DropDown, {
        key: 0,
        caption: caption,
        title: this.props.language.controls.link,
        autoHide: true,
        getContainerNode: this.props.getContainerNode,
        showArrow: false,
        ref: this.dropDownInstance,
        className: "control-item dropdown link-editor-dropdown"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-link-editor"
      }, allowInsertLinkText ? /*#__PURE__*/external_react_default().createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/external_react_default().createElement("input", {
        type: "text",
        value: text,
        spellCheck: false,
        disabled: textSelected,
        placeholder: this.props.language.linkEditor.textInputPlaceHolder,
        onKeyDown: this.handeKeyDown,
        onChange: this.handleTnputText
      })) : null, /*#__PURE__*/external_react_default().createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/external_react_default().createElement("input", {
        type: "text",
        value: href,
        spellCheck: false,
        placeholder: this.props.language.linkEditor.linkInputPlaceHolder,
        onKeyDown: this.handeKeyDown,
        onChange: this.handleInputLink
      })), /*#__PURE__*/external_react_default().createElement("div", {
        className: "switch-group"
      }, /*#__PURE__*/external_react_default().createElement(common_Switch, {
        active: target === '_blank',
        onClick: this.setTarget
      }), /*#__PURE__*/external_react_default().createElement("label", null, this.props.language.linkEditor.openInNewWindow)), /*#__PURE__*/external_react_default().createElement("div", {
        className: "buttons"
      }, /*#__PURE__*/external_react_default().createElement("a", {
        onClick: this.handleUnlink,
        role: "presentation",
        className: "primary button-remove-link pull-left"
      }, /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-close"
      }), /*#__PURE__*/external_react_default().createElement("span", null, this.props.language.linkEditor.removeLink)), /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.handleConfirm,
        className: "primary pull-right"
      }, this.props.language.base.confirm), /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        onClick: this.handleCancel,
        className: "default pull-right"
      }, this.props.language.base.cancel)))), /*#__PURE__*/external_react_default().createElement("button", {
        key: 1,
        type: "button",
        "data-title": this.props.language.controls.unlink,
        className: "control-item button",
        onClick: this.handleUnlink,
        disabled: !textSelected || !href
      }, /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-link-off"
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var _ref2 = nextProps || {},
        children = _ref2.children,
        attrProps = _objectWithoutProperties(_ref2, _excluded2);
      if (!!nextProps && prevState.propsStr !== generateNewObj(attrProps)) {
        var _ContentUtils$getSele = external_braft_utils_2_.ContentUtils.getSelectionEntityData(nextProps.editorState, 'LINK'),
          href = _ContentUtils$getSele.href,
          target = _ContentUtils$getSele.target;
        var textSelected = !external_braft_utils_2_.ContentUtils.isSelectionCollapsed(nextProps.editorState) && external_braft_utils_2_.ContentUtils.getSelectionBlockType(nextProps.editorState) !== 'atomic';
        var selectedText = '';
        if (textSelected) {
          selectedText = external_braft_utils_2_.ContentUtils.getSelectionText(nextProps.editorState);
        }
        return {
          textSelected: textSelected,
          text: selectedText,
          href: href || '',
          target: typeof target === 'undefined' ? nextProps.defaultLinkTarget || '' : target || '',
          propsStr: generateNewObj(attrProps)
        };
      }
      return null;
    }
  }]);
  return LinkEditor;
}((external_react_default()).Component);
LinkEditor.propTypes = {
  defaultLinkTarget: (prop_types_default()).any,
  language: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  allowInsertLinkText: (prop_types_default()).any,
  hooks: (prop_types_default()).any
};
/* harmony default export */ const business_LinkEditor = (LinkEditor);
;// CONCATENATED MODULE: ./configs/maps.jsx

var getHeadings = function getHeadings(lang) {
  return [{
    key: 'header-one',
    title: "".concat(lang.controls.header, " 1"),
    text: /*#__PURE__*/external_react_default().createElement("h1", null, lang.controls.header, " 1"),
    type: 'block-type',
    command: 'header-one'
  }, {
    key: 'header-two',
    title: "".concat(lang.controls.header, " 2"),
    text: /*#__PURE__*/external_react_default().createElement("h2", null, lang.controls.header, " 2"),
    type: 'block-type',
    command: 'header-two'
  }, {
    key: 'header-three',
    title: "".concat(lang.controls.header, " 3"),
    text: /*#__PURE__*/external_react_default().createElement("h3", null, lang.controls.header, " 3"),
    type: 'block-type',
    command: 'header-three'
  }, {
    key: 'header-four',
    title: "".concat(lang.controls.header, " 4"),
    text: /*#__PURE__*/external_react_default().createElement("h4", null, lang.controls.header, " 4"),
    type: 'block-type',
    command: 'header-four'
  }, {
    key: 'header-five',
    title: "".concat(lang.controls.header, " 5"),
    text: /*#__PURE__*/external_react_default().createElement("h5", null, lang.controls.header, " 5"),
    type: 'block-type',
    command: 'header-five'
  }, {
    key: 'header-six',
    title: "".concat(lang.controls.header, " 6"),
    text: /*#__PURE__*/external_react_default().createElement("h6", null, lang.controls.header, " 6"),
    type: 'block-type',
    command: 'header-six'
  }, {
    key: 'unstyled',
    title: lang.controls.normal,
    text: lang.controls.normal,
    type: 'block-type',
    command: 'unstyled'
  }];
};
var blocks = {
  'header-one': 'h1',
  'header-two': 'h2',
  'header-three': 'h3',
  'header-four': 'h4',
  'header-fiv': 'h5',
  'header-six': 'h6',
  unstyled: 'p',
  blockquote: 'blockquote'
};
;// CONCATENATED MODULE: ./components/business/Headings/index.jsx






var Headings = function Headings(props) {
  var dropDownInstance = /*#__PURE__*/external_react_default().createRef();
  var headings = getHeadings(props.language).filter(function (item) {
    return props.headings.indexOf(item.key) !== -1;
  });
  var currentHeadingIndex = headings.findIndex(function (item) {
    return item.command === props.current;
  });
  var caption = headings[currentHeadingIndex] ? headings[currentHeadingIndex].title : props.language.controls.normal;
  return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
    caption: caption,
    autoHide: true,
    getContainerNode: props.getContainerNode,
    title: props.language.controls.headings,
    arrowActive: currentHeadingIndex === 0,
    ref: dropDownInstance,
    className: "control-item dropdown headings-dropdown"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "menu"
  }, headings.map(function (item) {
    var isActive = props.current === item.command;
    return /*#__PURE__*/external_react_default().createElement("li", {
      key: esm_browser_v4(),
      role: "presentation",
      className: "menu-item".concat(isActive ? ' active' : ''),
      onClick: function onClick() {
        props.onChange(item.command, item.type);
        dropDownInstance.hide();
      }
    }, item.text);
  })));
};
Headings.propTypes = {
  headings: (prop_types_default()).any,
  current: (prop_types_default()).any,
  onChange: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  defaultCaption: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  language: (prop_types_default()).any
};
/* harmony default export */ const business_Headings = (Headings);
;// CONCATENATED MODULE: ./components/common/ColorPicker/index.jsx




var ColorPicker = function ColorPicker(props) {
  return /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-colors-wrap"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "bf-colors"
  }, props.presetColors.map(function (item) {
    var className = props.color && item.toLowerCase() === props.color.toLowerCase() ? 'color-item active' : 'color-item';
    return /*#__PURE__*/external_react_default().createElement("li", {
      role: "presentation",
      key: esm_browser_v4(),
      title: item,
      className: className,
      style: {
        color: item
      },
      "data-color": item.replace('#', ''),
      onClick: function onClick(e) {
        props.onChange(e.currentTarget.dataset.color, true);
      }
    });
  })));
};
ColorPicker.propTypes = {
  onChange: (prop_types_default()).any,
  color: (prop_types_default()).any,
  presetColors: (prop_types_default()).any,
  hooks: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  colorPicker: (prop_types_default()).any,
  autoHide: (prop_types_default()).any,
  theme: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  enableBackgroundColor: (prop_types_default()).any
};
/* harmony default export */ const common_ColorPicker = (ColorPicker);
;// CONCATENATED MODULE: ./components/business/TextColor/index.jsx







function TextColor_createSuper(Derived) { var hasNativeReflectConstruct = TextColor_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function TextColor_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }






var TextColor = /*#__PURE__*/function (_React$Component) {
  _inherits(TextColor, _React$Component);
  var _super = TextColor_createSuper(TextColor);
  function TextColor() {
    var _this;
    _classCallCheck(this, TextColor);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "state", {
      colorType: 'color'
    });
    _defineProperty(_assertThisInitialized(_this), "dropDownInstance", /*#__PURE__*/external_react_default().createRef());
    _defineProperty(_assertThisInitialized(_this), "switchColorType", function (_ref) {
      var currentTarget = _ref.currentTarget;
      _this.setState({
        colorType: currentTarget.dataset.type
      });
    });
    _defineProperty(_assertThisInitialized(_this), "toggleColor", function (color, closePicker) {
      if (color) {
        var newColor = color;
        var hookReturns = _this.props.hooks("toggle-text-".concat(_this.state.colorType), newColor)(newColor);
        if (hookReturns === false) {
          return false;
        }
        if (typeof hookReturns === 'string') {
          newColor = hookReturns;
        }
        if (_this.state.colorType === 'color') {
          _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionColor(_this.props.editorState, newColor));
        } else {
          _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionBackgroundColor(_this.props.editorState, newColor));
        }
      }
      if (closePicker) {
        _this.dropDownInstance.current.hide();
        _this.props.editor.requestFocus();
      }
      return true;
    });
    return _this;
  }
  _createClass(TextColor, [{
    key: "render",
    value: function render() {
      var captionStyle = {};
      var currentColor = null;
      var colorType = this.state.colorType;
      var selectionStyles = this.props.editorState.getCurrentInlineStyle().toJS();
      selectionStyles.forEach(function (style) {
        if (style.indexOf('COLOR-') === 0) {
          captionStyle.color = "#".concat(style.split('-')[1]);
          if (colorType === 'color') {
            currentColor = captionStyle.color;
          }
        }
        if (style.indexOf('BGCOLOR-') === 0) {
          captionStyle.backgroundColor = "#".concat(style.split('-')[1]);
          if (colorType === 'background-color') {
            currentColor = captionStyle.backgroundColor;
          }
        }
      });
      var caption = /*#__PURE__*/external_react_default().createElement("i", {
        style: captionStyle,
        className: "bfi-text-color"
      }, /*#__PURE__*/external_react_default().createElement("span", {
        className: "path1"
      }), /*#__PURE__*/external_react_default().createElement("span", {
        className: "path2"
      }));
      var ColorPicker = this.props.colorPicker || common_ColorPicker;
      return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
        caption: caption,
        title: this.props.language.controls.color,
        showArrow: false,
        autoHide: this.props.autoHide,
        theme: this.props.theme,
        getContainerNode: this.props.getContainerNode,
        ref: this.dropDownInstance,
        className: "control-item dropdown text-color-dropdown"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-text-color-picker-wrap"
      }, /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-color-switch-buttons",
        style: this.props.enableBackgroundColor ? {} : {
          display: 'none'
        }
      }, /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        "data-type": "color",
        className: colorType === 'color' ? 'active' : '',
        onClick: this.switchColorType
      }, this.props.language.controls.textColor), /*#__PURE__*/external_react_default().createElement("button", {
        type: "button",
        "data-type": "background-color",
        className: colorType === 'background-color' ? 'active' : '',
        onClick: this.switchColorType
      }, this.props.language.controls.backgroundColor)), /*#__PURE__*/external_react_default().createElement(ColorPicker, {
        width: 200,
        color: currentColor,
        disableAlpha: true,
        presetColors: this.props.colors,
        onChange: this.toggleColor
      })));
    }
  }]);
  return TextColor;
}((external_react_default()).Component);
TextColor.propTypes = {
  colors: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  language: (prop_types_default()).any,
  hooks: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  colorPicker: (prop_types_default()).any,
  autoHide: (prop_types_default()).any,
  theme: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  enableBackgroundColor: (prop_types_default()).any
};
/* harmony default export */ const business_TextColor = (TextColor);
;// CONCATENATED MODULE: ./components/business/FontSize/index.jsx






var toggleFontSize = function toggleFontSize(event, props) {
  var fontSize = event.currentTarget.dataset.size;
  var hookReturns = props.hooks('toggle-font-size', fontSize)(fontSize);
  if (hookReturns === false) {
    return false;
  }
  if (!isNaN(fontSize)) {
    fontSize = hookReturns;
  }
  console.log(props.editorState);
  props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionFontSize(props.editorState, fontSize));
  props.editor.requestFocus();
  return true;
};
function FontSize(props) {
  var caption = null;
  var currentFontSize = null;
  var dropDownInstance = null;
  props.fontSizes.find(function (item) {
    if (external_braft_utils_2_.ContentUtils.selectionHasInlineStyle(props.editorState, "FONTSIZE-".concat(item))) {
      caption = item;
      currentFontSize = item;
      return true;
    }
    return false;
  });
  return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
    autoHide: true,
    caption: caption || props.defaultCaption,
    getContainerNode: props.getContainerNode,
    title: props.language.controls.fontSize
    // eslint-disable-next-line no-return-assign
    ,
    ref: function ref(instance) {
      return dropDownInstance = instance;
    },
    className: "control-item dropdown bf-font-size-dropdown"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "bf-font-sizes"
  }, props.fontSizes.map(function (item) {
    return /*#__PURE__*/external_react_default().createElement("li", {
      key: esm_browser_v4(),
      role: "presentation",
      className: item === currentFontSize ? 'active' : null,
      "data-size": item,
      onClick: function onClick(event) {
        toggleFontSize(event, props);
        dropDownInstance.hide();
      }
    }, item);
  })));
}
FontSize.propTypes = {
  fontSizes: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  defaultCaption: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  language: (prop_types_default()).any
};
/* harmony default export */ const business_FontSize = (FontSize);
;// CONCATENATED MODULE: ./components/business/LineHeight/index.jsx






var toggleLineHeight = function toggleLineHeight(event, props) {
  var lineHeight = event.currentTarget.dataset.size;
  var hookReturns = props.hooks('toggle-line-height', lineHeight)(lineHeight);
  if (hookReturns === false) {
    return false;
  }
  if (!isNaN(hookReturns)) {
    lineHeight = hookReturns;
  }
  props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionLineHeight(props.editorState, lineHeight));
  props.editor.requestFocus();
  return true;
};
function LineHeight(props) {
  var caption = null;
  var currentLineHeight = null;
  var dropDownInstance = /*#__PURE__*/external_react_default().createRef();
  props.lineHeights.find(function (item) {
    if (external_braft_utils_2_.ContentUtils.selectionHasInlineStyle(props.editorState, "LINEHEIGHT-".concat(item))) {
      caption = item;
      currentLineHeight = item;
      return true;
    }
    return false;
  });
  return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
    autoHide: true,
    caption: caption || props.defaultCaption,
    getContainerNode: props.getContainerNode,
    title: props.language.controls.lineHeight,
    ref: dropDownInstance,
    className: "control-item dropdown bf-line-height-dropdown"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "bf-line-heights"
  }, props.lineHeights.map(function (item) {
    return /*#__PURE__*/external_react_default().createElement("li", {
      key: esm_browser_v4(),
      role: "presentation",
      className: item === currentLineHeight ? 'active' : null,
      "data-size": item,
      onClick: function onClick(event) {
        toggleLineHeight(event, props);
        dropDownInstance.current.hide();
      }
    }, item);
  })));
}
LineHeight.propTypes = {
  headings: (prop_types_default()).any,
  lineHeights: (prop_types_default()).any,
  current: (prop_types_default()).any,
  onChange: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  defaultCaption: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  language: (prop_types_default()).any
};
/* harmony default export */ const business_LineHeight = (LineHeight);
;// CONCATENATED MODULE: ./components/business/FontFamily/index.jsx






var toggleFontFamily = function toggleFontFamily(event, props) {
  var fontFamilyName = event.currentTarget.dataset.name;
  var hookReturns = props.hooks('toggle-font-family', fontFamilyName)(fontFamilyName, props.fontFamilies);
  if (hookReturns === false) {
    return false;
  }
  if (typeof hookReturns === 'string') {
    fontFamilyName = hookReturns;
  }
  props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionFontFamily(props.editorState, fontFamilyName));
  props.editor.requestFocus();
  return true;
};
function FontFamily(props) {
  var caption = null;
  var currentIndex = null;
  var dropDownInstance = null;
  props.fontFamilies.find(function (item, index) {
    if (external_braft_utils_2_.ContentUtils.selectionHasInlineStyle(props.editorState, "FONTFAMILY-".concat(item.name))) {
      caption = item.name;
      currentIndex = index;
      return true;
    }
    return false;
  });
  return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
    caption: caption || props.defaultCaption,
    getContainerNode: props.getContainerNode,
    title: props.language.controls.fontFamily,
    autoHide: true,
    arrowActive: currentIndex === 0
    // eslint-disable-next-line no-return-assign
    ,
    ref: function ref(instance) {
      return dropDownInstance = instance;
    },
    className: "control-item dropdown font-family-dropdown"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "menu"
  }, props.fontFamilies.map(function (item, index) {
    return /*#__PURE__*/external_react_default().createElement("li", {
      key: esm_browser_v4(),
      role: "presentation",
      className: "menu-item ".concat(index === currentIndex ? 'active' : ''),
      "data-name": item.name,
      onClick: function onClick(event) {
        toggleFontFamily(event, props);
        dropDownInstance.hide();
      }
    }, /*#__PURE__*/external_react_default().createElement("span", {
      style: {
        fontFamily: item.family
      }
    }, item.name));
  })));
}
FontFamily.propTypes = {
  fontFamilies: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  defaultCaption: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  language: (prop_types_default()).any
};
/* harmony default export */ const business_FontFamily = (FontFamily);
;// CONCATENATED MODULE: ./components/business/TextAlign/index.jsx







function TextAlign_createSuper(Derived) { var hasNativeReflectConstruct = TextAlign_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function TextAlign_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/* eslint-disable camelcase */






var TextAlign = /*#__PURE__*/function (_React$Component) {
  _inherits(TextAlign, _React$Component);
  var _super = TextAlign_createSuper(TextAlign);
  function TextAlign() {
    var _this;
    _classCallCheck(this, TextAlign);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "state", {
      currentAlignment: undefined
    });
    _defineProperty(_assertThisInitialized(_this), "setAlignment", function (event) {
      var alignment = event.currentTarget.dataset.alignment;
      var hookReturns = _this.props.hooks('toggle-text-alignment', alignment)(alignment);
      if (_this.props.textAligns.indexOf(hookReturns) > -1) {
        alignment = hookReturns;
      }
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionAlignment(_this.props.editorState, alignment));
      _this.props.editor.requestFocus();
    });
    return _this;
  }
  _createClass(TextAlign, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var textAlignmentTitles = [this.props.language.controls.alignLeft, this.props.language.controls.alignCenter, this.props.language.controls.alignRight, this.props.language.controls.alignJustify];
      return /*#__PURE__*/external_react_default().createElement(business_ControlGroup, null, this.props.textAligns.map(function (item, index) {
        return /*#__PURE__*/external_react_default().createElement("button", {
          type: "button",
          key: esm_browser_v4(),
          "data-title": textAlignmentTitles[index],
          "data-alignment": item,
          className: dist_mergeClassNames('control-item button', item === _this2.state.currentAlignment && 'active'),
          onClick: _this2.setAlignment
        }, /*#__PURE__*/external_react_default().createElement("i", {
          className: "bfi-align-".concat(item)
        }));
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(next) {
      return {
        currentAlignment: external_braft_utils_2_.ContentUtils.getSelectionBlockData(next.editorState, 'textAlign')
      };
    }
  }]);
  return TextAlign;
}((external_react_default()).Component);
TextAlign.propTypes = {
  textAligns: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  language: (prop_types_default()).any,
  hooks: (prop_types_default()).any,
  editorState: (prop_types_default()).any
};
/* harmony default export */ const business_TextAlign = (TextAlign);
;// CONCATENATED MODULE: ./components/business/EmojiPicker/index.jsx






var insertEmoji = function insertEmoji(event, props) {
  var emoji = event.currentTarget.dataset.emoji;
  var hookReturns = props.hooks('insert-emoji', emoji)(emoji);
  if (hookReturns === false) {
    return false;
  }
  if (typeof hookReturns === 'string') {
    emoji = hookReturns;
  }
  props.editor.setValue(external_braft_utils_2_.ContentUtils.insertText(props.editorState, emoji));
  props.editor.requestFocus();
  return true;
};
function EmojiPicker(props) {
  return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
    caption: props.defaultCaption,
    autoHide: true,
    showArrow: false,
    getContainerNode: props.getContainerNode,
    title: props.language.controls.emoji,
    className: "control-item dropdown bf-emoji-dropdown"
  }, /*#__PURE__*/external_react_default().createElement("div", {
    className: "bf-emojis-wrap"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "bf-emojis"
  }, props.emojis.map(function (item) {
    return /*#__PURE__*/external_react_default().createElement("li", {
      key: esm_browser_v4(),
      "data-emoji": item,
      onClick: function onClick(event) {
        return insertEmoji(event, props);
      },
      role: "presentation"
    }, item);
  }))));
}
EmojiPicker.propTypes = {
  defaultCaption: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  emojis: (prop_types_default()).any,
  language: (prop_types_default()).any
};
/* harmony default export */ const business_EmojiPicker = (EmojiPicker);
;// CONCATENATED MODULE: ./components/business/LetterSpacing/index.jsx






var toggleLetterSpacing = function toggleLetterSpacing(event, props) {
  var letterSpacing = event.currentTarget.dataset.size;
  var hookReturns = props.hooks('toggle-letter-spacing', letterSpacing)(letterSpacing);
  if (hookReturns === false) {
    return false;
  }
  if (!isNaN(hookReturns)) {
    letterSpacing = hookReturns;
  }
  props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionLetterSpacing(props.editorState, letterSpacing));
  props.editor.requestFocus();
  return true;
};
function LetterSpacing(props) {
  var caption = null;
  var currentLetterSpacing = null;
  var dropDownInstance = null;
  props.letterSpacings.find(function (item) {
    if (external_braft_utils_2_.ContentUtils.selectionHasInlineStyle(props.editorState, "LETTERSPACING-".concat(item))) {
      caption = item;
      currentLetterSpacing = item;
      return true;
    }
    return false;
  });
  return /*#__PURE__*/external_react_default().createElement(common_DropDown, {
    autoHide: true,
    caption: caption || props.defaultCaption,
    getContainerNode: props.getContainerNode,
    title: props.language.controls.letterSpacing
    // eslint-disable-next-line no-return-assign
    ,
    ref: function ref(instance) {
      return dropDownInstance = instance;
    },
    className: "control-item dropdown bf-letter-spacing-dropdown"
  }, /*#__PURE__*/external_react_default().createElement("ul", {
    className: "bf-letter-spacings"
  }, props.letterSpacings.map(function (item) {
    return /*#__PURE__*/external_react_default().createElement("li", {
      key: esm_browser_v4(),
      role: "presentation",
      className: item === currentLetterSpacing ? 'active' : null,
      "data-size": item,
      onClick: function onClick(event) {
        toggleLetterSpacing(event, props);
        dropDownInstance.hide();
      }
    }, item);
  })));
}
LetterSpacing.propTypes = {
  headings: (prop_types_default()).any,
  letterSpacings: (prop_types_default()).any,
  current: (prop_types_default()).any,
  onChange: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  defaultCaption: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  language: (prop_types_default()).any
};
/* harmony default export */ const business_LetterSpacing = (LetterSpacing);
;// CONCATENATED MODULE: ./components/business/TextIndent/index.jsx







function TextIndent_createSuper(Derived) { var hasNativeReflectConstruct = TextIndent_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function TextIndent_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




var TextIndent = /*#__PURE__*/function (_React$Component) {
  _inherits(TextIndent, _React$Component);
  var _super = TextIndent_createSuper(TextIndent);
  function TextIndent() {
    var _this;
    _classCallCheck(this, TextIndent);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "state", {
      currentIndent: 0
    });
    _defineProperty(_assertThisInitialized(_this), "increaseIndent", function () {
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.increaseSelectionIndent(_this.props.editorState));
      _this.props.editor.requestFocus();
    });
    _defineProperty(_assertThisInitialized(_this), "decreaseIndent", function () {
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.decreaseSelectionIndent(_this.props.editorState));
      _this.props.editor.requestFocus();
    });
    return _this;
  }
  _createClass(TextIndent, [{
    key: "render",
    value: function render() {
      var currentIndent = this.state.currentIndent;
      var language = this.props.language;
      return /*#__PURE__*/external_react_default().createElement(business_ControlGroup, null, /*#__PURE__*/external_react_default().createElement("button", {
        key: 0,
        type: "button",
        "data-title": language.controls.increaseIndent,
        disabled: currentIndent >= 6,
        className: "control-item button button-indent-increase".concat(currentIndent > 0 && currentIndent < 6 ? ' active' : ''),
        onClick: this.increaseIndent
      }, /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-indent-increase"
      })), /*#__PURE__*/external_react_default().createElement("button", {
        key: 1,
        type: "button",
        "data-title": language.controls.decreaseIndent,
        disabled: currentIndent <= 0,
        className: "control-item button button-indent-decrease",
        onClick: this.decreaseIndent
      }, /*#__PURE__*/external_react_default().createElement("i", {
        className: "bfi-indent-decrease"
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      return {
        currentIndent: external_braft_utils_2_.ContentUtils.getSelectionBlockData(nextProps.editorState, 'textIndent') || 0
      };
    }
  }]);
  return TextIndent;
}((external_react_default()).Component);
TextIndent.propTypes = {
  colors: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  language: (prop_types_default()).any,
  hooks: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  colorPicker: (prop_types_default()).any,
  autoHide: (prop_types_default()).any,
  theme: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  enableBackgroundColor: (prop_types_default()).any
};
/* harmony default export */ const business_TextIndent = (TextIndent);
;// CONCATENATED MODULE: ./components/business/ControlBar/index.jsx








function ControlBar_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function ControlBar_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ControlBar_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ControlBar_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function ControlBar_createSuper(Derived) { var hasNativeReflectConstruct = ControlBar_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function ControlBar_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/* eslint-disable react/no-danger */



















var commandHookMap = {
  'inline-style': 'toggle-inline-style',
  'block-type': 'change-block-type',
  'editor-method': 'exec-editor-command'
};
var exclusiveInlineStyles = {
  superscript: 'subscript',
  subscript: 'superscript'
};
var mergeControls = function mergeControls(commonProps, builtControls, extensionControls, extendControls) {
  var customExtendControls = extendControls.map(function (item) {
    return typeof item === 'function' ? item(commonProps) : item;
  });
  if (extensionControls.length === 0 && customExtendControls.length === 0) {
    return builtControls;
  }
  return builtControls.map(function (item) {
    return customExtendControls.find(function (subItem) {
      return subItem.replace === (item.key || item);
    }) || extensionControls.find(function (subItem) {
      return subItem.replace === (item.key || item);
    }) || item;
  }).concat(extensionControls.length ? 'separator' : '').concat(extensionControls.filter(function (item) {
    return !item.replace;
  })).concat(customExtendControls.filter(function (item) {
    return typeof item === 'string' || !item.replace;
  }));
};
var ControlBar = /*#__PURE__*/function (_React$Component) {
  _inherits(ControlBar, _React$Component);
  var _super = ControlBar_createSuper(ControlBar);
  function ControlBar() {
    var _this;
    _classCallCheck(this, ControlBar);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "allControls", []);
    _defineProperty(_assertThisInitialized(_this), "mediaLibiraryModal", null);
    _defineProperty(_assertThisInitialized(_this), "extendedModals", {});
    _defineProperty(_assertThisInitialized(_this), "openBraftFinder", function () {
      if (!_this.props.braftFinder || !_this.props.braftFinder.ReactComponent) {
        return false;
      }
      if (_this.props.hooks('open-braft-finder')() === false) {
        return false;
      }
      var mediaProps = _this.props.media;
      var MediaLibrary = _this.props.braftFinder.ReactComponent;
      _this.mediaLibiraryModal = showModal({
        title: _this.props.language.controls.mediaLibirary,
        language: _this.props.language,
        width: 640,
        showFooter: false,
        onClose: mediaProps.onClose,
        component: /*#__PURE__*/external_react_default().createElement(MediaLibrary, {
          accepts: mediaProps.accepts,
          onCancel: _this.closeBraftFinder,
          onInsert: _this.insertMedias,
          onChange: mediaProps.onChange,
          externals: mediaProps.externals,
          onBeforeSelect: _this.bindBraftFinderHook('select-medias'),
          onBeforeDeselect: _this.bindBraftFinderHook('deselect-medias'),
          onBeforeRemove: _this.bindBraftFinderHook('remove-medias'),
          onBeforeInsert: _this.bindBraftFinderHook('insert-medias'),
          onFileSelect: _this.bindBraftFinderHook('select-files')
        })
      });
      return true;
    });
    _defineProperty(_assertThisInitialized(_this), "bindBraftFinderHook", function (hookName) {
      return function () {
        return _this.props.hooks(hookName, arguments.length <= 0 ? undefined : arguments[0]).apply(void 0, arguments);
      };
    });
    _defineProperty(_assertThisInitialized(_this), "insertMedias", function (medias) {
      _this.props.editor.setValue(external_braft_utils_2_.ContentUtils.insertMedias(_this.props.editorState, medias));
      _this.props.editor.requestFocus();
      if (_this.props.media.onInsert) {
        _this.props.media.onInsert(medias);
      }
      _this.closeBraftFinder();
    });
    _defineProperty(_assertThisInitialized(_this), "closeBraftFinder", function () {
      if (_this.props.media.onCancel) {
        _this.props.media.onCancel();
      }
      if (_this.mediaLibiraryModal) {
        _this.mediaLibiraryModal.close();
      }
    });
    return _this;
  }
  _createClass(ControlBar, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;
      var language = this.props.language;
      this.allControls.forEach(function (item) {
        if (item.type === 'modal') {
          if (item.modal && item.modal.id && _this2.extendedModals[item.modal.id]) {
            _this2.extendedModals[item.modal.id].update(ControlBar_objectSpread(ControlBar_objectSpread({}, item.modal), {}, {
              language: language
            }));
          }
        }
      });
    }
  }, {
    key: "getControlItemClassName",
    value: function getControlItemClassName(data) {
      var className = 'control-item button';
      var type = data.type,
        command = data.command;
      if (type === 'inline-style' && external_braft_utils_2_.ContentUtils.selectionHasInlineStyle(this.props.editorState, command)) {
        className += ' active';
      } else if (type === 'block-type' && external_braft_utils_2_.ContentUtils.getSelectionBlockType(this.props.editorState) === command) {
        className += ' active';
      } else if (type === 'entity' && external_braft_utils_2_.ContentUtils.getSelectionEntityType(this.props.editorState) === command) {
        className += ' active';
      }
      return className;
    }
  }, {
    key: "applyControl",
    value: function applyControl(command, type) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var hookCommand = command;
      var hookReturns = this.props.hooks(commandHookMap[type] || type, hookCommand)(hookCommand);
      var editorState = this.props.editorState;
      if (hookReturns === false) {
        return false;
      }
      if (typeof hookReturns === 'string') {
        hookCommand = hookReturns;
      }
      if (type === 'inline-style') {
        var exclusiveInlineStyle = exclusiveInlineStyles[hookCommand];
        if (exclusiveInlineStyle && external_braft_utils_2_.ContentUtils.selectionHasInlineStyle(editorState, exclusiveInlineStyle)) {
          editorState = external_braft_utils_2_.ContentUtils.toggleSelectionInlineStyle(editorState, exclusiveInlineStyle);
        }
        this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionInlineStyle(editorState, hookCommand));
      }
      if (type === 'block-type') {
        this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionBlockType(editorState, hookCommand));
      }
      if (type === 'entity') {
        this.props.editor.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionEntity(editorState, {
          type: hookCommand,
          mutability: data.mutability || 'MUTABLE',
          data: data.data || {}
        }));
      }
      if (type === 'editor-method' && this.props.editor[hookCommand]) {
        this.props.editor[hookCommand]();
      }
      return this.props.editor;
    }
  }, {
    key: "preventDefault",
    value: function preventDefault(event) {
      var tagName = event.target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'label') {
        // ...
      } else {
        event.preventDefault();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props = this.props,
        allowInsertLinkText = _this$props.allowInsertLinkText,
        className = _this$props.className,
        colorPicker = _this$props.colorPicker,
        colorPickerAutoHide = _this$props.colorPickerAutoHide,
        colorPickerTheme = _this$props.colorPickerTheme,
        colors = _this$props.colors,
        controls = _this$props.controls,
        defaultLinkTarget = _this$props.defaultLinkTarget,
        editor = _this$props.editor,
        editorId = _this$props.editorId,
        editorState = _this$props.editorState,
        emojis = _this$props.emojis,
        extendControls = _this$props.extendControls,
        fontFamilies = _this$props.fontFamilies,
        fontSizes = _this$props.fontSizes,
        getContainerNode = _this$props.getContainerNode,
        headings = _this$props.headings,
        hooks = _this$props.hooks,
        language = _this$props.language,
        letterSpacings = _this$props.letterSpacings,
        lineHeights = _this$props.lineHeights,
        media = _this$props.media,
        style = _this$props.style,
        textAligns = _this$props.textAligns,
        textBackgroundColor = _this$props.textBackgroundColor;
      var currentBlockType = external_braft_utils_2_.ContentUtils.getSelectionBlockType(editorState);
      var commonProps = {
        editor: editor,
        editorId: editorId,
        editorState: editorState,
        language: language,
        getContainerNode: getContainerNode,
        hooks: hooks
      };
      var renderedControls = [];
      var editorControls = configs_controls(language, editor);
      var extensionControls = getExtensionControls(editorId);
      var allControls = mergeControls(commonProps, controls, extensionControls, extendControls);
      this.allControls = allControls;
      return /*#__PURE__*/external_react_default().createElement("div", {
        className: "bf-controlbar ".concat(className || ''),
        style: style,
        onMouseDown: this.preventDefault,
        role: "button",
        tabIndex: "0"
      }, allControls.map(function (item) {
        var itemKey = typeof item === 'string' ? item : item.key;
        if (typeof itemKey !== 'string') {
          return null;
        }
        if (renderedControls.indexOf(itemKey) > -1) {
          return null;
        }
        if (itemKey.toLowerCase() === 'separator') {
          return /*#__PURE__*/external_react_default().createElement("span", {
            key: esm_browser_v4(),
            className: "separator-line"
          });
        }
        var controlItem = editorControls.find(function (subItem) {
          return subItem.key.toLowerCase() === itemKey.toLowerCase();
        });
        if (typeof item !== 'string') {
          controlItem = ControlBar_objectSpread(ControlBar_objectSpread({}, controlItem), item);
        }
        if (!controlItem) {
          return null;
        }
        renderedControls.push(itemKey);
        if (controlItem.type === 'headings') {
          return /*#__PURE__*/external_react_default().createElement(business_Headings, _extends({
            key: esm_browser_v4(),
            headings: headings,
            current: currentBlockType,
            onChange: function onChange(command) {
              return _this3.applyControl(command, 'block-type');
            }
          }, commonProps));
        }
        if (controlItem.type === 'text-color') {
          return /*#__PURE__*/external_react_default().createElement(business_TextColor, _extends({
            key: esm_browser_v4(),
            colors: colors,
            colorPicker: colorPicker,
            theme: colorPickerTheme,
            autoHide: colorPickerAutoHide,
            enableBackgroundColor: textBackgroundColor
          }, commonProps));
        }
        if (controlItem.type === 'font-size') {
          return /*#__PURE__*/external_react_default().createElement(business_FontSize, _extends({
            key: esm_browser_v4(),
            fontSizes: fontSizes,
            defaultCaption: controlItem.title
          }, commonProps));
        }
        if (controlItem.type === 'line-height') {
          return /*#__PURE__*/external_react_default().createElement(business_LineHeight, _extends({
            key: esm_browser_v4(),
            lineHeights: lineHeights,
            defaultCaption: controlItem.title
          }, commonProps));
        }
        if (controlItem.type === 'letter-spacing') {
          return /*#__PURE__*/external_react_default().createElement(business_LetterSpacing, _extends({
            key: esm_browser_v4(),
            letterSpacings: letterSpacings,
            defaultCaption: controlItem.title
          }, commonProps));
        }
        if (controlItem.type === 'text-indent') {
          return /*#__PURE__*/external_react_default().createElement(business_TextIndent, _extends({
            key: esm_browser_v4(),
            defaultCaption: controlItem.title
          }, commonProps));
        }
        if (controlItem.type === 'font-family') {
          return /*#__PURE__*/external_react_default().createElement(business_FontFamily, _extends({
            key: esm_browser_v4(),
            fontFamilies: fontFamilies,
            defaultCaption: controlItem.title
          }, commonProps));
        }
        if (controlItem.type === 'emoji') {
          return /*#__PURE__*/external_react_default().createElement(business_EmojiPicker, _extends({
            key: esm_browser_v4(),
            emojis: emojis,
            defaultCaption: controlItem.text
          }, commonProps));
        }
        if (controlItem.type === 'link') {
          return /*#__PURE__*/external_react_default().createElement(business_LinkEditor, _extends({
            key: esm_browser_v4(),
            defaultLinkTarget: defaultLinkTarget,
            allowInsertLinkText: allowInsertLinkText
          }, commonProps));
        }
        if (controlItem.type === 'text-align') {
          return /*#__PURE__*/external_react_default().createElement(business_TextAlign, _extends({
            key: esm_browser_v4(),
            textAligns: textAligns
          }, commonProps));
        }
        if (controlItem.type === 'media') {
          if (!media.image && !media.video && !media.audio) {
            return null;
          }
          return /*#__PURE__*/external_react_default().createElement("button", {
            type: "button",
            key: esm_browser_v4(),
            "data-title": controlItem.title,
            disabled: controlItem.disabled,
            className: "control-item media button",
            onClick: _this3.openBraftFinder
          }, controlItem.text);
        }
        if (controlItem.type === 'dropdown') {
          return /*#__PURE__*/external_react_default().createElement(common_DropDown, _extends({
            key: esm_browser_v4(),
            className: "control-item extend-control-item dropdown ".concat(controlItem.className || ''),
            caption: controlItem.text,
            htmlCaption: controlItem.html,
            showArrow: controlItem.showArrow,
            title: controlItem.title,
            arrowActive: controlItem.arrowActive,
            theme: controlItem.theme,
            autoHide: controlItem.autoHide,
            disabled: controlItem.disabled,
            ref: controlItem.ref
          }, commonProps), controlItem.component);
        }
        if (controlItem.type === 'modal') {
          return /*#__PURE__*/external_react_default().createElement("button", {
            type: "button",
            key: esm_browser_v4(),
            "data-title": controlItem.title,
            disabled: controlItem.disabled,
            className: "control-item extend-control-item button ".concat(controlItem.className || ''),
            dangerouslySetInnerHTML: controlItem.html ? {
              __html: controlItem.html
            } : null,
            onClick: function onClick(event) {
              if (controlItem.modal && controlItem.modal.id) {
                if (_this3.extendedModals[controlItem.modal.id]) {
                  _this3.extendedModals[controlItem.modal.id].active = true;
                  _this3.extendedModals[controlItem.modal.id].update(ControlBar_objectSpread(ControlBar_objectSpread({}, controlItem.modal), {}, {
                    language: language
                  }));
                } else {
                  _this3.extendedModals[controlItem.modal.id] = showModal(ControlBar_objectSpread(ControlBar_objectSpread({}, controlItem.modal), {}, {
                    language: language
                  }));
                  if (controlItem.modal.onCreate) {
                    controlItem.modal.onCreate(_this3.extendedModals[controlItem.modal.id]);
                  }
                }
              }
              if (controlItem.onClick) {
                controlItem.onClick(event);
              }
            }
          }, !controlItem.html ? controlItem.text : null);
        }
        if (controlItem.type === 'component') {
          return /*#__PURE__*/external_react_default().createElement("div", {
            key: esm_browser_v4(),
            className: "component-wrapper ".concat(controlItem.className || '')
          }, controlItem.component);
        }
        if (controlItem.type === 'button') {
          return /*#__PURE__*/external_react_default().createElement("button", {
            type: "button",
            key: esm_browser_v4(),
            "data-title": controlItem.title,
            disabled: controlItem.disabled,
            className: "control-item button ".concat(controlItem.className || ''),
            dangerouslySetInnerHTML: controlItem.html ? {
              __html: controlItem.html
            } : null,
            onClick: function onClick(event) {
              return controlItem.onClick && controlItem.onClick(event);
            }
          }, !controlItem.html ? controlItem.text : null);
        }
        if (controlItem) {
          var disabled = false;
          if (controlItem.command === 'undo') {
            disabled = editorState.getUndoStack().size === 0;
          } else if (controlItem.command === 'redo') {
            disabled = editorState.getRedoStack().size === 0;
          }
          return /*#__PURE__*/external_react_default().createElement("button", {
            type: "button",
            key: esm_browser_v4(),
            disabled: disabled,
            "data-title": controlItem.title,
            className: _this3.getControlItemClassName({
              type: controlItem.type,
              command: controlItem.command
            }),
            onClick: function onClick() {
              return _this3.applyControl(controlItem.command, controlItem.type, controlItem.data);
            }
          }, controlItem.text);
        }
        return null;
      }));
    }
  }]);
  return ControlBar;
}((external_react_default()).Component);

ControlBar.propTypes = {
  allowInsertLinkText: (prop_types_default()).any,
  braftFinder: (prop_types_default()).any,
  className: (prop_types_default()).any,
  colorPicker: (prop_types_default()).any,
  colorPickerAutoHide: (prop_types_default()).any,
  colorPickerTheme: (prop_types_default()).any,
  colors: (prop_types_default()).any,
  controls: (prop_types_default()).any,
  defaultLinkTarget: (prop_types_default()).any,
  editor: (prop_types_default()).any,
  editorId: (prop_types_default()).any,
  editorState: (prop_types_default()).any,
  emojis: (prop_types_default()).any,
  extendControls: (prop_types_default()).any,
  fontFamilies: (prop_types_default()).any,
  fontSizes: (prop_types_default()).any,
  getContainerNode: (prop_types_default()).any,
  headings: (prop_types_default()).any,
  hooks: (prop_types_default()).any,
  language: (prop_types_default()).any,
  letterSpacings: (prop_types_default()).any,
  lineHeights: (prop_types_default()).any,
  media: (prop_types_default()).any,
  style: (prop_types_default()).any,
  textAligns: (prop_types_default()).any,
  textBackgroundColor: (prop_types_default()).any
};
;// CONCATENATED MODULE: ./editor/index.jsx









var editor_excluded = ["value", "defaultValue", "onChange"];
function editor_createSuper(Derived) { var hasNativeReflectConstruct = editor_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function editor_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function editor_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function editor_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? editor_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : editor_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
















var buildHooks = function buildHooks(hooks) {
  return function (hookName) {
    var defaultReturns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return hooks[hookName] || function () {
      return defaultReturns;
    };
  };
};
var filterColors = function filterColors(colors, colors2) {
  return colors.filter(function (item) {
    return !colors2.find(function (color) {
      return color.toLowerCase() === item.toLowerCase();
    });
  }).filter(function (item, index, array) {
    return array.indexOf(item) === index;
  });
};
var isControlEnabled = function isControlEnabled(props, controlName) {
  return [].concat(_toConsumableArray(props.controls), _toConsumableArray(props.extendControls)).find(function (item) {
    return item === controlName || item.key === controlName;
  }) && props.excludeControls.indexOf(controlName) === -1;
};
var getConvertOptions = function getConvertOptions(props) {
  var editorId = props.editorId || props.id;
  var convertOptions = editor_objectSpread(editor_objectSpread(editor_objectSpread({}, configs_props.converts), props.converts), {}, {
    fontFamilies: props.fontFamilies
  });
  convertOptions.styleImportFn = compositeStyleImportFn(convertOptions.styleImportFn, editorId);
  convertOptions.styleExportFn = compositeStyleExportFn(convertOptions.styleExportFn, editorId);
  convertOptions.entityImportFn = compositeEntityImportFn(convertOptions.entityImportFn, editorId);
  convertOptions.entityExportFn = compositeEntityExportFn(convertOptions.entityExportFn, editorId);
  convertOptions.blockImportFn = compositeBlockImportFn(convertOptions.blockImportFn, editorId);
  convertOptions.blockExportFn = compositeBlockExportFn(convertOptions.blockExportFn, editorId);
  return convertOptions;
};
var BraftEditor = /*#__PURE__*/function (_React$Component) {
  _inherits(BraftEditor, _React$Component);
  var _super = editor_createSuper(BraftEditor);
  function BraftEditor(props) {
    var _this;
    _classCallCheck(this, BraftEditor);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "onChange", function (editorState, callback) {
      var newEditorState = editor_objectSpread({}, editorState);
      if (!(editorState instanceof external_draft_js_.EditorState)) {
        newEditorState = external_draft_js_.EditorState.set(editorState, {
          decorator: _this.editorDecorators
        });
      }
      if (!newEditorState.convertOptions) {
        console.log(newEditorState);
        newEditorState.setConvertOptions(getConvertOptions(_this.editorProps));
      }
      _this.setState({
        editorState: newEditorState
      }, function () {
        if (_this.props.onChange) {
          _this.props.onChange(newEditorState);
        }
        if (callback) {
          callback(newEditorState);
        }
      });
    });
    _defineProperty(_assertThisInitialized(_this), "getDraftInstance", function () {
      return _this.draftInstance;
    });
    _defineProperty(_assertThisInitialized(_this), "getFinderInstance", function () {
      return _this.braftFinder;
    });
    _defineProperty(_assertThisInitialized(_this), "getValue", function () {
      return _this.state.editorState;
    });
    _defineProperty(_assertThisInitialized(_this), "setValue", function (editorState, callback) {
      return _this.onChange(editorState, callback);
    });
    _defineProperty(_assertThisInitialized(_this), "forceRender", function () {
      var selectionState = _this.state.editorState.getSelection();
      _this.setValue(external_draft_js_.EditorState.set(_this.state.editorState, {
        decorator: _this.editorDecorators
      }), function () {
        _this.setValue(external_draft_js_.EditorState.forceSelection(_this.state.editorState, selectionState));
      });
    });
    _defineProperty(_assertThisInitialized(_this), "onTab", function (event) {
      if (keyCommandHandlers('tab', _this.state.editorState, _assertThisInitialized(_this)) === 'handled') {
        event.preventDefault();
      }
      if (_this.editorProps.onTab) {
        _this.editorProps.onTab(event);
      }
    });
    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      _this.isFocused = true;
      if (_this.editorProps.onFocus) {
        _this.editorProps.onFocus(_this.state.editorState);
      }
    });
    _defineProperty(_assertThisInitialized(_this), "onBlur", function () {
      _this.isFocused = false;
      if (_this.editorProps.onBlur) {
        _this.editorProps.onBlur(_this.state.editorState);
      }
    });
    _defineProperty(_assertThisInitialized(_this), "requestFocus", function () {
      setTimeout(function () {
        return _this.draftInstance.focus();
      }, 0);
    });
    _defineProperty(_assertThisInitialized(_this), "handleKeyCommand", function (command, editorState) {
      return keyCommandHandlers(command, editorState, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handleReturn", function (event, editorState) {
      return returnHandlers(event, editorState, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handleBeforeInput", function (chars, editorState) {
      return beforeInputHandlers(chars, editorState, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handleDrop", function (selectionState, dataTransfer) {
      return dropHandlers(selectionState, dataTransfer, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handleDroppedFiles", function (selectionState, files) {
      return droppedFilesHandlers(selectionState, files, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handlePastedFiles", function (files) {
      return pastedFilesHandlers(files, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handleCopyContent", function (event) {
      return copyHandlers(event, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handlePastedText", function (text, html, editorState) {
      return pastedTextHandlers(text, html, editorState, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "handleCompositionStart", function (event) {
      return compositionStartHandler(event, _assertThisInitialized(_this));
    });
    _defineProperty(_assertThisInitialized(_this), "undo", function () {
      _this.setValue(external_braft_utils_2_.ContentUtils.undo(_this.state.editorState));
    });
    _defineProperty(_assertThisInitialized(_this), "redo", function () {
      _this.setValue(external_braft_utils_2_.ContentUtils.redo(_this.state.editorState));
    });
    _defineProperty(_assertThisInitialized(_this), "removeSelectionInlineStyles", function () {
      _this.setValue(external_braft_utils_2_.ContentUtils.removeSelectionInlineStyles(_this.state.editorState));
    });
    _defineProperty(_assertThisInitialized(_this), "insertHorizontalLine", function () {
      _this.setValue(external_braft_utils_2_.ContentUtils.insertHorizontalLine(_this.state.editorState));
    });
    _defineProperty(_assertThisInitialized(_this), "clearEditorContent", function () {
      _this.setValue(external_braft_utils_2_.ContentUtils.clear(_this.state.editorState), function (editorState) {
        _this.setValue(external_braft_utils_2_.ContentUtils.toggleSelectionIndent(editorState, 0));
      });
    });
    _defineProperty(_assertThisInitialized(_this), "toggleFullscreen", function (fullscreen) {
      _this.setState(function (prevState) {
        return {
          isFullscreen: typeof fullscreen !== 'undefined' ? fullscreen : !prevState.isFullscreen
        };
      }, function () {
        if (_this.editorProps.onFullscreen) {
          _this.editorProps.onFullscreen(_this.state.isFullscreen);
        }
      });
    });
    _defineProperty(_assertThisInitialized(_this), "setEditorContainerNode", function (containerNode) {
      _this.containerNode = containerNode;
    });
    _this.editorProps = _this.getEditorProps(props);
    _this.editorDecorators = getDecorators(_this.editorProps.editorId || _this.editorProps.id);
    _this.controlBarInstance = /*#__PURE__*/external_react_default().createRef();
    _this.isFocused = false;
    _this.isLiving = false;
    _this.braftFinder = null;
    _this.valueInitialized = !!(_this.props.defaultValue || _this.props.value);
    var defaultEditorState = (_this.props.defaultValue || _this.props.value) instanceof external_draft_js_.EditorState ? _this.props.defaultValue || _this.props.value : external_draft_js_.EditorState.createEmpty(_this.editorDecorators);
    defaultEditorState.setConvertOptions(getConvertOptions(_this.editorProps));
    var tempColors = [];
    if (external_braft_utils_2_.ContentUtils.isEditorState(defaultEditorState)) {
      var colors = external_braft_utils_2_.ColorUtils.detectColorsFromDraftState(defaultEditorState.toRAW(true));
      defaultEditorState.setConvertOptions(getConvertOptions(_this.editorProps));
      tempColors = filterColors(colors, _this.editorProps.colors);
    }
    _this.state = {
      tempColors: tempColors,
      editorState: defaultEditorState,
      isFullscreen: false,
      propsStr: JSON.stringify(props)
    };
    _this.containerNode = null;
    return _this;
  }

  // eslint-disable-next-line react/sort-comp
  _createClass(BraftEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (isControlEnabled(this.editorProps, 'media')) {
        var _this$editorProps = this.editorProps,
          language = _this$editorProps.language,
          media = _this$editorProps.media;
        var _defaultProps$media$m = editor_objectSpread(editor_objectSpread({}, configs_props.media), media),
          uploadFn = _defaultProps$media$m.uploadFn,
          validateFn = _defaultProps$media$m.validateFn,
          items = _defaultProps$media$m.items;
        this.braftFinder = new (external_braft_finder_2_default())({
          items: items,
          language: language,
          uploader: uploadFn,
          validator: validateFn
        });
        this.forceUpdate();
      }
      this.isLiving = true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.exec) {
        this.updateExec(this.props);
      }
      if (prevState.editorState !== this.state.editorState) {
        this.state.editorState.setConvertOptions(getConvertOptions(this.editorProps));
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$controlBarInsta;
      this.isLiving = false;
      if ((_this$controlBarInsta = this.controlBarInstance) !== null && _this$controlBarInsta !== void 0 && _this$controlBarInsta.current) {
        this.controlBarInstance.current.closeBraftFinder();
      }
    }
  }, {
    key: "updateExec",
    value: function updateExec(props) {
      var _this2 = this;
      this.editorProps = this.getEditorProps(props);
      var editorState = props.value;
      var _this$editorProps2 = this.editorProps,
        media = _this$editorProps2.media,
        language = _this$editorProps2.language;
      var currentProps = this.getEditorProps();
      if (!isControlEnabled(currentProps, 'media') && isControlEnabled(this.editorProps, 'media') && !this.braftFinder) {
        var _defaultProps$media$m2 = editor_objectSpread(editor_objectSpread({}, configs_props.media), media),
          uploadFn = _defaultProps$media$m2.uploadFn,
          validateFn = _defaultProps$media$m2.validateFn,
          items = _defaultProps$media$m2.items;
        this.braftFinder = new (external_braft_finder_2_default())({
          items: items,
          language: language,
          uploader: uploadFn,
          validator: validateFn
        });
        this.forceUpdate();
      }
      if (media && media.items && this.braftFinder) {
        this.braftFinder.setItems(media.items);
      }
      var nextEditorState;
      if (!this.valueInitialized && typeof this.props.defaultValue === 'undefined' && external_braft_utils_2_.ContentUtils.isEditorState(props.defaultValue)) {
        nextEditorState = props.defaultValue;
      } else if (external_braft_utils_2_.ContentUtils.isEditorState(editorState)) {
        nextEditorState = editorState;
      }
      if (nextEditorState) {
        if (nextEditorState && nextEditorState !== this.state.editorState) {
          var tempColors = external_braft_utils_2_.ColorUtils.detectColorsFromDraftState(nextEditorState.toRAW(true));
          nextEditorState.setConvertOptions(getConvertOptions(this.editorProps));
          this.setState(function (prevState) {
            return {
              tempColors: filterColors([].concat(_toConsumableArray(prevState.tempColors), _toConsumableArray(tempColors)), currentProps.colors),
              editorState: nextEditorState,
              exec: false
            };
          }, function () {
            if (_this2.props.onChange) {
              _this2.props.onChange(nextEditorState);
            }
          });
        } else {
          this.setState({
            editorState: nextEditorState,
            exec: false
          });
        }
      } else {
        this.setState({
          exec: false
        });
      }
    }
  }, {
    key: "getEditorProps",
    value: function getEditorProps() {
      var _this3 = this;
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var value = props.value,
        defaultValue = props.defaultValue,
        onChange = props.onChange,
        restProps = _objectWithoutProperties(props, editor_excluded); // eslint-disable-line no-unused-vars
      var propInterceptors = getPropInterceptors(restProps.editorId || restProps.id);
      if (propInterceptors.length === 0) {
        return restProps;
      }
      var porpsMap = (0,external_immutable_.Map)(restProps);
      propInterceptors.forEach(function (interceptor) {
        porpsMap = porpsMap.merge((0,external_immutable_.Map)(interceptor(porpsMap.toJS(), _this3) || {}));
      });
      return porpsMap.toJS();
    }
  }, {
    key: "lockOrUnlockEditor",
    value: function lockOrUnlockEditor(editorLocked) {
      this.setState({
        editorLocked: editorLocked
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$editorProps3 = this.editorProps,
        editorId = _this$editorProps3.editorId,
        controls = _this$editorProps3.controls,
        media = _this$editorProps3.media,
        language = _this$editorProps3.language,
        hooks = _this$editorProps3.hooks,
        placeholder = _this$editorProps3.placeholder;
      var _this$editorProps4 = this.editorProps,
        id = _this$editorProps4.id,
        excludeControls = _this$editorProps4.excludeControls,
        extendControls = _this$editorProps4.extendControls,
        readOnly = _this$editorProps4.readOnly,
        disabled = _this$editorProps4.disabled,
        colors = _this$editorProps4.colors,
        colorPicker = _this$editorProps4.colorPicker,
        colorPickerTheme = _this$editorProps4.colorPickerTheme,
        colorPickerAutoHide = _this$editorProps4.colorPickerAutoHide,
        fontSizes = _this$editorProps4.fontSizes,
        fontFamilies = _this$editorProps4.fontFamilies,
        emojis = _this$editorProps4.emojis,
        fixPlaceholder = _this$editorProps4.fixPlaceholder,
        headings = _this$editorProps4.headings,
        imageControls = _this$editorProps4.imageControls,
        imageResizable = _this$editorProps4.imageResizable,
        imageEqualRatio = _this$editorProps4.imageEqualRatio,
        lineHeights = _this$editorProps4.lineHeights,
        letterSpacings = _this$editorProps4.letterSpacings,
        textAligns = _this$editorProps4.textAligns,
        textBackgroundColor = _this$editorProps4.textBackgroundColor,
        allowInsertLinkText = _this$editorProps4.allowInsertLinkText,
        defaultLinkTarget = _this$editorProps4.defaultLinkTarget,
        extendAtomics = _this$editorProps4.extendAtomics,
        className = _this$editorProps4.className,
        style = _this$editorProps4.style,
        controlBarClassName = _this$editorProps4.controlBarClassName,
        controlBarStyle = _this$editorProps4.controlBarStyle,
        contentClassName = _this$editorProps4.contentClassName,
        contentStyle = _this$editorProps4.contentStyle,
        stripPastedStyles = _this$editorProps4.stripPastedStyles,
        componentBelowControlBar = _this$editorProps4.componentBelowControlBar;
      var _this$state = this.state,
        isFullscreen = _this$state.isFullscreen,
        editorState = _this$state.editorState;
      editorId = editorId || id;
      hooks = buildHooks(hooks);
      controls = controls.filter(function (item) {
        return excludeControls.indexOf(item) === -1;
      });
      language = (typeof language === 'function' ? language(languages, 'braft-editor') : languages[language]) || languages[configs_props.language];
      var externalMedias = editor_objectSpread(editor_objectSpread({}, configs_props.media.externals), media && media.externals);
      var accepts = editor_objectSpread(editor_objectSpread({}, configs_props.media.accepts), media && media.accepts);
      media = editor_objectSpread(editor_objectSpread(editor_objectSpread({}, configs_props.media), media), {}, {
        externalMedias: externalMedias,
        accepts: accepts
      });
      if (!media.uploadFn) {
        media.video = false;
        media.audio = false;
      }
      var controlBarProps = {
        editor: this,
        editorState: editorState,
        braftFinder: this.braftFinder,
        ref: this.controlBarInstance,
        getContainerNode: function getContainerNode() {
          return _this4.containerNode;
        },
        className: controlBarClassName,
        style: controlBarStyle,
        colors: [].concat(_toConsumableArray(colors), _toConsumableArray(this.state.tempColors)),
        colorPicker: colorPicker,
        colorPickerTheme: colorPickerTheme,
        colorPickerAutoHide: colorPickerAutoHide,
        hooks: hooks,
        editorId: editorId,
        media: media,
        controls: controls,
        language: language,
        extendControls: extendControls,
        headings: headings,
        fontSizes: fontSizes,
        fontFamilies: fontFamilies,
        emojis: emojis,
        lineHeights: lineHeights,
        letterSpacings: letterSpacings,
        textAligns: textAligns,
        textBackgroundColor: textBackgroundColor,
        allowInsertLinkText: allowInsertLinkText,
        defaultLinkTarget: defaultLinkTarget
      };
      var unitExportFn = editorState.convertOptions.unitExportFn;
      var commonProps = {
        editor: this,
        editorId: editorId,
        hooks: hooks,
        editorState: editorState,
        containerNode: this.containerNode,
        imageControls: imageControls,
        imageResizable: imageResizable,
        language: language,
        extendAtomics: extendAtomics,
        imageEqualRatio: imageEqualRatio
      };
      var blockRendererFn = getBlockRendererFn(commonProps, this.editorProps.blockRendererFn);
      var blockRenderMap = getBlockRenderMap(commonProps, this.editorProps.blockRenderMap);
      var blockStyleFn = getBlockStyleFn(this.editorProps.blockStyleFn);
      var customStyleMap = getCustomStyleMap(commonProps, this.editorProps.customStyleMap);
      var customStyleFn = getCustomStyleFn(commonProps, {
        fontFamilies: fontFamilies,
        unitExportFn: unitExportFn,
        customStyleFn: this.editorProps.customStyleFn
      });
      var keyBindingFn = keybindings(this.editorProps.keyBindingFn);
      var mixedProps = {};
      if (this.state.editorLocked || this.editorProps.disabled || this.editorProps.readOnly || this.editorProps.draftProps.readOnly) {
        mixedProps.readOnly = true;
      }
      if (placeholder && fixPlaceholder && editorState.isEmpty() && editorState.getCurrentContent().getFirstBlock().getType() !== 'unstyled') {
        placeholder = '';
      }
      var draftProps = editor_objectSpread(editor_objectSpread({
        ref: function ref(instance) {
          _this4.draftInstance = instance;
        },
        editorState: editorState,
        handleKeyCommand: this.handleKeyCommand,
        handleReturn: this.handleReturn,
        handleBeforeInput: this.handleBeforeInput,
        handleDrop: this.handleDrop,
        handleDroppedFiles: this.handleDroppedFiles,
        handlePastedText: this.handlePastedText,
        handlePastedFiles: this.handlePastedFiles,
        onChange: this.onChange,
        onTab: this.onTab,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        blockRenderMap: blockRenderMap,
        blockRendererFn: blockRendererFn,
        blockStyleFn: blockStyleFn,
        customStyleMap: customStyleMap,
        customStyleFn: customStyleFn,
        keyBindingFn: keyBindingFn,
        placeholder: placeholder,
        stripPastedStyles: stripPastedStyles
      }, this.editorProps.draftProps), mixedProps);
      return /*#__PURE__*/external_react_default().createElement("div", {
        style: style,
        ref: this.setEditorContainerNode,
        className: dist_mergeClassNames('bf-container', className, disabled && 'disabled', readOnly && 'read-only', isFullscreen && 'fullscreen')
      }, /*#__PURE__*/external_react_default().createElement(ControlBar, controlBarProps), componentBelowControlBar, /*#__PURE__*/external_react_default().createElement("div", {
        onCompositionStart: this.handleCompositionStart,
        className: "bf-content ".concat(contentClassName),
        onCopy: this.handleCopyContent,
        style: contentStyle
      }, /*#__PURE__*/external_react_default().createElement(external_draft_js_.Editor, draftProps)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (JSON.stringify(nextProps) !== prevState.propsStr) {
        return {
          exec: true,
          propsStr: JSON.stringify(nextProps)
        };
      }
      return null;
    }
  }]);
  return BraftEditor;
}((external_react_default()).Component);
BraftEditor.defaultProps = configs_props;
BraftEditor.propTypes = {
  value: (prop_types_default()).any,
  onChange: (prop_types_default()).any,
  defaultValue: (prop_types_default()).any
};
/* harmony default export */ const editor = (BraftEditor);

;// CONCATENATED MODULE: ./index.jsx


function index_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function index_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? index_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : index_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }




external_draft_js_.EditorState.prototype.setConvertOptions = function setConvertOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.convertOptions = options;
};
external_draft_js_.EditorState.prototype.toHTML = function toHTML() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var convertOptions = this.convertOptions || {};
  return (0,external_braft_convert_2_.convertEditorStateToHTML)(this, index_objectSpread(index_objectSpread({}, convertOptions), options));
};
external_draft_js_.EditorState.prototype.toRAW = function toRAW(noStringify) {
  return noStringify ? (0,external_braft_convert_2_.convertEditorStateToRaw)(this) : JSON.stringify((0,external_braft_convert_2_.convertEditorStateToRaw)(this));
};
external_draft_js_.EditorState.prototype.toText = function toText() {
  return this.getCurrentContent().getPlainText();
};
external_draft_js_.EditorState.prototype.isEmpty = function isEmpty() {
  return !this.getCurrentContent().hasText();
};
external_draft_js_.EditorState.createFrom = function (content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var customOptions = index_objectSpread({}, options);
  customOptions.unitExportFn = customOptions.unitExportFn || editor.defaultProps.converts.unitExportFn;
  customOptions.styleImportFn = compositeStyleImportFn(customOptions.styleImportFn, customOptions.editorId);
  customOptions.entityImportFn = compositeEntityImportFn(customOptions.entityImportFn, customOptions.editorId);
  customOptions.blockImportFn = compositeBlockImportFn(customOptions.blockImportFn, customOptions.editorId);
  var editorState = null;
  if (content instanceof external_draft_js_.EditorState) {
    editorState = content;
  }
  if (_typeof(content) === 'object' && content && content.blocks && content.entityMap) {
    editorState = (0,external_braft_convert_2_.convertRawToEditorState)(content, getDecorators(customOptions.editorId));
  }
  if (typeof content === 'string') {
    try {
      if (/^(-)?\d+$/.test(content)) {
        editorState = (0,external_braft_convert_2_.convertHTMLToEditorState)(content, getDecorators(customOptions.editorId), customOptions, 'create');
      } else {
        editorState = external_draft_js_.EditorState.createFrom(JSON.parse(content), customOptions);
      }
    } catch (error) {
      editorState = (0,external_braft_convert_2_.convertHTMLToEditorState)(content, getDecorators(customOptions.editorId), customOptions, 'create');
    }
  }
  if (typeof content === 'number') {
    editorState = (0,external_braft_convert_2_.convertHTMLToEditorState)(content.toLocaleString().replace(/,/g, ''), getDecorators(customOptions.editorId), customOptions, 'create');
  } else {
    editorState = external_draft_js_.EditorState.createEmpty(getDecorators(customOptions.editorId));
  }
  customOptions.styleExportFn = compositeStyleExportFn(customOptions.styleExportFn, customOptions.editorId);
  customOptions.entityExportFn = compositeEntityExportFn(customOptions.entityExportFn, customOptions.editorId);
  customOptions.blockExportFn = compositeBlockExportFn(customOptions.blockExportFn, customOptions.editorId);
  editorState.setConvertOptions(customOptions);
  return editorState;
};
editor.createEditorState = external_draft_js_.EditorState.createFrom;
/* harmony default export */ const index = (createExtensibleEditor(editor));


// 2.1 version development plan
// [] Optimizing the selection of multiple lines of text is an error when inserting a link
// [] Add a new image delete hook in the editor

// 2.2 development plan
// [] table function
// [] Beautify the UI, including icons and interface style

// version 2.3 development plan
// [] Primary md shortcut input support
// [] simple editing functions such as picture cropping
// [] allows custom shortcuts
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});