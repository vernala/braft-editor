import React from 'react';
import PropTypes from 'prop-types';
import BraftFinder from 'braft-finder-2';
import { ColorUtils, ContentUtils } from 'braft-utils-2';
import { Editor, EditorState } from 'draft-js';
import { Map } from 'immutable';
import mergeClassNames from '@inner-desktop/mergeclassnames';

import languages from 'languages';
import getKeyBindingFn from 'configs/keybindings';
import defaultProps from 'configs/props';
import {
  keyCommandHandlers,
  returnHandlers,
  beforeInputHandlers,
  dropHandlers,
  droppedFilesHandlers,
  copyHandlers,
  pastedFilesHandlers,
  pastedTextHandlers,
  compositionStartHandler,
} from 'configs/handlers';
import {
  getBlockRendererFn,
  getBlockRenderMap,
  getBlockStyleFn,
  getCustomStyleMap,
  getCustomStyleFn,
  getDecorators,
} from 'renderers';
import {
  compositeStyleImportFn,
  compositeStyleExportFn,
  compositeEntityImportFn,
  compositeEntityExportFn,
  compositeBlockImportFn,
  compositeBlockExportFn,
  getPropInterceptors,
} from 'helpers/extension';
import ControlBar from 'components/business/ControlBar';

import 'draft-js/dist/Draft.css';
import 'assets/scss/_base.scss';

const buildHooks =
  (hooks) =>
    (hookName, defaultReturns = {}) =>
      hooks[hookName] || (() => defaultReturns);

const filterColors = (colors, colors2) =>
  colors
    .filter(
      (item) =>
        !colors2.find((color) => color.toLowerCase() === item.toLowerCase()),
    )
    .filter((item, index, array) => array.indexOf(item) === index);

const isControlEnabled = (props, controlName) =>
  [...props.controls, ...props.extendControls].find(
    (item) => item === controlName || item.key === controlName,
  ) && props.excludeControls.indexOf(controlName) === -1;

const getConvertOptions = (props) => {
  const editorId = props.editorId || props.id;
  const convertOptions = {
    ...defaultProps.converts,
    ...props.converts,
    fontFamilies: props.fontFamilies,
  };

  convertOptions.styleImportFn = compositeStyleImportFn(
    convertOptions.styleImportFn,
    editorId,
  );
  convertOptions.styleExportFn = compositeStyleExportFn(
    convertOptions.styleExportFn,
    editorId,
  );
  convertOptions.entityImportFn = compositeEntityImportFn(
    convertOptions.entityImportFn,
    editorId,
  );
  convertOptions.entityExportFn = compositeEntityExportFn(
    convertOptions.entityExportFn,
    editorId,
  );
  convertOptions.blockImportFn = compositeBlockImportFn(
    convertOptions.blockImportFn,
    editorId,
  );
  convertOptions.blockExportFn = compositeBlockExportFn(
    convertOptions.blockExportFn,
    editorId,
  );

  return convertOptions;
};

class BraftEditor extends React.Component {
  constructor(props) {
    const { defaultValue, value, onChange, ...otherProps } = props || {};
    super(props);

    this.editorProps = this.getEditorProps(props);
    this.editorDecorators = getDecorators(
      this.editorProps.editorId || this.editorProps.id,
    );
    this.controlBarInstance = React.createRef();
    this.isFocused = false;
    this.isLiving = false;
    this.braftFinder = null;
    this.valueInitialized = !!(defaultValue || value);

    const defaultEditorState =
      (props.defaultValue || props.value) instanceof EditorState
        ? props.defaultValue || props.value
        : EditorState.createEmpty(this.editorDecorators);
    defaultEditorState.setConvertOptions(getConvertOptions(this.editorProps));

    let tempColors = [];

    if (ContentUtils.isEditorState(defaultEditorState)) {
      const colors = ColorUtils.detectColorsFromDraftState(
        defaultEditorState.toRAW(true),
      );
      defaultEditorState.setConvertOptions(getConvertOptions(this.editorProps));

      tempColors = filterColors(colors, this.editorProps.colors);
    }

    this.state = {
      tempColors,
      editorState: defaultEditorState,
      isFullscreen: false,
      propsStr: JSON.stringify({
        ...otherProps,
        value: value && value instanceof EditorState ? value?.toHTML() : value,
      }),
    };
    this.containerNode = null;
  }

  // eslint-disable-next-line react/sort-comp
  componentDidMount() {
    if (isControlEnabled(this.editorProps, 'media')) {
      const { language, media } = this.editorProps;
      const { uploadFn, validateFn, items } = {
        ...defaultProps.media,
        ...media,
      };

      this.braftFinder = new BraftFinder({
        items,
        language,
        uploader: uploadFn,
        validator: validateFn,
      });

      this.forceUpdate();
    }
    this.isLiving = true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { defaultValue, value, onChange, ...otherProps } = nextProps || {};
    const str = JSON.stringify({
      ...otherProps,
      value: value && value instanceof EditorState ? value?.toHTML() : value,
    });
    if (str !== prevState.propsStr) {
      return { exec: true, propsStr: str };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.exec) {
      this.updateExec(this.props);
    }

    if (prevState.editorState !== this.state.editorState) {
      this.state.editorState.setConvertOptions(
        getConvertOptions(this.editorProps),
      );
    }
  }

  componentWillUnmount() {
    this.isLiving = false;
    if (this.controlBarInstance?.current) {
      this.controlBarInstance.current.closeBraftFinder();
    }
  }

  updateExec(props) {
    this.editorProps = this.getEditorProps(props);

    const { value: editorState } = props;
    const { media, language } = this.editorProps;
    const currentProps = this.getEditorProps();

    if (
      !isControlEnabled(currentProps, 'media') &&
      isControlEnabled(this.editorProps, 'media') &&
      !this.braftFinder
    ) {
      const { uploadFn, validateFn, items } = {
        ...defaultProps.media,
        ...media,
      };

      this.braftFinder = new BraftFinder({
        items,
        language,
        uploader: uploadFn,
        validator: validateFn,
      });

      this.forceUpdate();
    }

    if (media && media.items && this.braftFinder) {
      this.braftFinder.setItems(media.items);
    }

    let nextEditorState;

    if (
      !this.valueInitialized &&
      typeof this.props.defaultValue === 'undefined' &&
      ContentUtils.isEditorState(props.defaultValue)
    ) {
      nextEditorState = props.defaultValue;
    } else if (ContentUtils.isEditorState(editorState)) {
      nextEditorState = editorState;
    }

    if (nextEditorState) {
      if (nextEditorState && nextEditorState !== this.state.editorState) {
        const tempColors = ColorUtils.detectColorsFromDraftState(
          nextEditorState.toRAW(true),
        );
        nextEditorState.setConvertOptions(getConvertOptions(this.editorProps));

        this.setState(
          (prevState) => ({
            tempColors: filterColors(
              [...prevState.tempColors, ...tempColors],
              currentProps.colors,
            ),
            editorState: nextEditorState,
            exec: false,
          }),
          () => {
            if (this.props.onChange) {
              this.props.onChange(nextEditorState);
            }
          },
        );
      } else {
        this.setState({
          editorState: nextEditorState,
          exec: false,
        });
      }
    } else {
      this.setState({ exec: false });
    }
  }

  getEditorProps(props = this.props) {
    const { value, defaultValue, onChange, ...restProps } = props; // eslint-disable-line no-unused-vars
    const propInterceptors = getPropInterceptors(
      restProps.editorId || restProps.id,
    );

    if (propInterceptors.length === 0) {
      return restProps;
    }

    let porpsMap = Map(restProps);

    propInterceptors.forEach((interceptor) => {
      porpsMap = porpsMap.merge(Map(interceptor(porpsMap.toJS(), this) || {}));
    });

    return porpsMap.toJS();
  }

  onChange = (editorState, callback) => {
    const oriProto = Object.getPrototypeOf(editorState);
    let newEditorState = Object.assign(Object.create(oriProto), editorState);
    if (!(editorState instanceof EditorState)) {
      newEditorState = EditorState.set(editorState, {
        decorator: this.editorDecorators,
      });
    }

    if (!newEditorState.convertOptions) {
      newEditorState.setConvertOptions(getConvertOptions(this.editorProps));
    }

    this.setState({ editorState: newEditorState }, () => {
      if (this.props.onChange) {
        this.props.onChange(newEditorState);
      }
      if (callback) {
        callback(newEditorState);
      }
    });
  };

  getDraftInstance = () => this.draftInstance;

  getFinderInstance = () => this.braftFinder;

  getValue = () => this.state.editorState;

  setValue = (editorState, callback) => this.onChange(editorState, callback);

  forceRender = () => {
    const selectionState = this.state.editorState.getSelection();

    this.setValue(
      EditorState.set(this.state.editorState, {
        decorator: this.editorDecorators,
      }),
      () => {
        this.setValue(
          EditorState.forceSelection(this.state.editorState, selectionState),
        );
      },
    );
  };

  onTab = (event) => {
    if (keyCommandHandlers('tab', this.state.editorState, this) === 'handled') {
      event.preventDefault();
    }
    if (this.editorProps.onTab) {
      this.editorProps.onTab(event);
    }
  };

  onFocus = () => {
    this.isFocused = true;
    if (this.editorProps.onFocus) {
      this.editorProps.onFocus(this.state.editorState);
    }
  };

  onBlur = () => {
    this.isFocused = false;
    if (this.editorProps.onBlur) {
      this.editorProps.onBlur(this.state.editorState);
    }
  };

  requestFocus = () => {
    setTimeout(() => this.draftInstance.focus(), 0);
  };

  handleKeyCommand = (command, editorState) =>
    keyCommandHandlers(command, editorState, this);

  handleReturn = (event, editorState) =>
    returnHandlers(event, editorState, this);

  handleBeforeInput = (chars, editorState) =>
    beforeInputHandlers(chars, editorState, this);

  handleDrop = (selectionState, dataTransfer) =>
    dropHandlers(selectionState, dataTransfer, this);

  handleDroppedFiles = (selectionState, files) =>
    droppedFilesHandlers(selectionState, files, this);

  handlePastedFiles = (files) => pastedFilesHandlers(files, this);

  handleCopyContent = (event) => copyHandlers(event, this);

  handlePastedText = (text, html, editorState) =>
    pastedTextHandlers(text, html, editorState, this);

  handleCompositionStart = (event) => compositionStartHandler(event, this);

  undo = () => {
    this.setValue(ContentUtils.undo(this.state.editorState));
  };

  redo = () => {
    this.setValue(ContentUtils.redo(this.state.editorState));
  };

  removeSelectionInlineStyles = () => {
    this.setValue(
      ContentUtils.removeSelectionInlineStyles(this.state.editorState),
    );
  };

  insertHorizontalLine = () => {
    this.setValue(ContentUtils.insertHorizontalLine(this.state.editorState));
  };

  clearEditorContent = () => {
    this.setValue(ContentUtils.clear(this.state.editorState), (editorState) => {
      this.setValue(ContentUtils.toggleSelectionIndent(editorState, 0));
    });
  };

  toggleFullscreen = (fullscreen) => {
    this.setState(
      (prevState) => ({
        isFullscreen:
          typeof fullscreen !== 'undefined'
            ? fullscreen
            : !prevState.isFullscreen,
      }),
      () => {
        if (this.editorProps.onFullscreen) {
          this.editorProps.onFullscreen(this.state.isFullscreen);
        }
      },
    );
  };

  lockOrUnlockEditor(editorLocked) {
    this.setState({ editorLocked });
  }

  setEditorContainerNode = (containerNode) => {
    this.containerNode = containerNode;
  };

  render() {
    let { editorId, controls, media, language, hooks, placeholder } =
      this.editorProps;
    const {
      id,
      excludeControls,
      extendControls,
      readOnly,
      disabled,
      colors,
      colorPicker,
      colorPickerTheme,
      colorPickerAutoHide,
      fontSizes,
      fontFamilies,
      emojis,
      fixPlaceholder,
      headings,
      imageControls,
      imageResizable,
      imageEqualRatio,
      lineHeights,
      letterSpacings,
      textAligns,
      textBackgroundColor,
      allowInsertLinkText,
      defaultLinkTarget,
      extendAtomics,
      className,
      style,
      controlBarClassName,
      controlBarStyle,
      contentClassName,
      contentStyle,
      stripPastedStyles,
      componentBelowControlBar,
    } = this.editorProps;

    const { isFullscreen, editorState } = this.state;

    editorId = editorId || id;
    hooks = buildHooks(hooks);
    controls = controls.filter((item) => excludeControls.indexOf(item) === -1);
    language =
      (typeof language === 'function'
        ? language(languages, 'braft-editor')
        : languages[language]) || languages[defaultProps.language];

    const externalMedias = {
      ...defaultProps.media.externals,
      ...(media && media.externals),
    };

    const accepts = {
      ...defaultProps.media.accepts,
      ...(media && media.accepts),
    };

    media = { ...defaultProps.media, ...media, externalMedias, accepts };

    if (!media.uploadFn) {
      media.video = false;
      media.audio = false;
    }

    const controlBarProps = {
      editor: this,
      editorState,
      braftFinder: this.braftFinder,
      ref: this.controlBarInstance,
      getContainerNode: () => this.containerNode,
      className: controlBarClassName,
      style: controlBarStyle,
      colors: [...colors, ...this.state.tempColors],
      colorPicker,
      colorPickerTheme,
      colorPickerAutoHide,
      hooks,
      editorId,
      media,
      controls,
      language,
      extendControls,
      headings,
      fontSizes,
      fontFamilies,
      emojis,
      lineHeights,
      letterSpacings,
      textAligns,
      textBackgroundColor,
      allowInsertLinkText,
      defaultLinkTarget,
    };

    const { unitExportFn } = editorState.convertOptions;

    const commonProps = {
      editor: this,
      editorId,
      hooks,
      editorState,
      containerNode: this.containerNode,
      imageControls,
      imageResizable,
      language,
      extendAtomics,
      imageEqualRatio,
    };

    const blockRendererFn = getBlockRendererFn(
      commonProps,
      this.editorProps.blockRendererFn,
    );
    const blockRenderMap = getBlockRenderMap(
      commonProps,
      this.editorProps.blockRenderMap,
    );
    const blockStyleFn = getBlockStyleFn(this.editorProps.blockStyleFn);
    const customStyleMap = getCustomStyleMap(
      commonProps,
      this.editorProps.customStyleMap,
    );
    const customStyleFn = getCustomStyleFn(commonProps, {
      fontFamilies,
      unitExportFn,
      customStyleFn: this.editorProps.customStyleFn,
    });

    const keyBindingFn = getKeyBindingFn(this.editorProps.keyBindingFn);

    const mixedProps = {};

    if (
      this.state.editorLocked ||
      this.editorProps.disabled ||
      this.editorProps.readOnly ||
      this.editorProps.draftProps.readOnly
    ) {
      mixedProps.readOnly = true;
    }

    if (
      placeholder &&
      fixPlaceholder &&
      editorState.isEmpty() &&
      editorState.getCurrentContent().getFirstBlock().getType() !== 'unstyled'
    ) {
      placeholder = '';
    }

    // console.log(editorState);

    const draftProps = {
      ref: (instance) => {
        this.draftInstance = instance;
      },
      editorState,
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
      blockRenderMap,
      blockRendererFn,
      blockStyleFn,
      customStyleMap,
      customStyleFn,
      keyBindingFn,
      placeholder,
      stripPastedStyles,
      ...this.editorProps.draftProps,
      ...mixedProps,
    };

    return (
      <div
        style={style}
        ref={this.setEditorContainerNode}
        className={mergeClassNames(
          'bf-container',
          className,
          disabled && 'disabled',
          readOnly && 'read-only',
          isFullscreen && 'fullscreen',
        )}
      >
        <ControlBar {...controlBarProps} />
        {componentBelowControlBar}
        <div
          onCompositionStart={this.handleCompositionStart}
          className={`bf-content ${contentClassName}`}
          onCopy={this.handleCopyContent}
          style={contentStyle}
        >
          <Editor {...draftProps} />
        </div>
      </div>
    );
  }
}

BraftEditor.defaultProps = defaultProps;

BraftEditor.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.any,
  defaultValue: PropTypes.any,
};

export default BraftEditor;

export { EditorState };
