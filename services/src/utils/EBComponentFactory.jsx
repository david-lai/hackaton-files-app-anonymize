//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// EBComponentFactory is the component factory for EB
// This implementaton provides components for the Security Planning UI
//

// Libraries
import React from 'react';
import { AphroditeApi, WindowsMessageUtil } from 'prism-utils-common';
import { OpenInNewWindowIcon, TextLabel, Link, FlexLayout } from 'prism-reactjs';

// Local includes
import PopupContainer from '../popups/PopupContainer';
import AppConstants from './AppConstants';
import CatPolicies from './CatPolicies';

import i18n from './i18n';
// Helper to translate strings from this module
const i18nT = (key, defaultValue) => i18n.getInstance().t(
  'EBComponentFactory', key, defaultValue);

// The custom components for sec planning
const COMPONENTS = {
  ACTIONS: 'actions',
  NUMBER_OF_VMS: 'number_of_vms'
};


// Components
class EBComponentFactory {

  constructor(options) {
    options = options || {};
    this.parser = options.parser;
    this.popupContext = {};
  }

  // Set context for popups.
  // In this case, we use it for storing the catsPoliciesMap
  setPopupContext(context) {
    this.popupContext = context;
  }

  onOpenPeClick(e) {
    console.log(e.currentTarget.getAttribute('data-name'));
    // const clusterUuid = e.currentTarget.getAttribute('data-name');
    const clusterUuid = '000597f7-e2bc-4a93-0000-00000000b7b7';
    WindowsMessageUtil.postMessage({
      service: AppConstants.SERVICE_NAME.PRISM_UI,
      target: AppConstants.IFRAME_EVENT_OPEN_PE,
      state: AppConstants.FS_PC_TO_PE,
      serviceTargets: clusterUuid
    }, window.location.ancestorOrigins[0], window.parent);    
  }

  getComponent(componentId, options) {
    switch (componentId) {
      case COMPONENTS.ACTIONS:
        return (
          <Link className="manage-link" data-name={ options.options.entity.nvm_uuid_list }
              onClick={ this.onOpenPeClick }>
            <FlexLayout alignItems="center" itemSpacing="5px">
              <TextLabel className="nsg-example-icon-text">{i18nT('manage', 'Manage')}</TextLabel>
              <OpenInNewWindowIcon />
            </FlexLayout>  
          </Link>);
      case COMPONENTS.NUMBER_OF_VMS:
        const numberOfVms = options.options.entity.nvm_uuid_list.split(',').length || 0;
        return (<span>{ numberOfVms }</span>);
      default:
        return this.defaultFactory.getComponent(componentId, options);
    }
  }

  // Pluck a nested network_function_list argument - Single value
  _getAttrValue(scChain, attr) {
    return scChain.network_function_list && scChain.network_function_list.length &&
      scChain.network_function_list[0][attr];
  }

  // Pluck a nested network_function_list argument - Array of value
  _getAttrValues(scChain, attr) {
    return scChain.network_function_list && scChain.network_function_list.length &&
      scChain.network_function_list.map(nf => nf[attr]);
  }

  // Given an entity, get the category value(s) its using
  _getCatValues(entity) {
    const catsFilter = this._getAttrValue(entity, 'category_filter');
    return catsFilter && catsFilter.params &&
      catsFilter.params[AppConstants.CATEGORY.NET_SERVICE_PROVIDER];
  }

  /**
   * Return the registered filter parser
   * @returns {Object} Filter Parser
   */
  getFilterParser() {
    return this.parser || this.defaultFactory.getFilterParser();
  }

  /**
   * Sets the default factory. Used to delegate for
   * components that this factory does not provide.
   * @param {Object} factory - Default factory from EB
   */
  setDefaultFactory(factory) {
    this.defaultFactory = factory;
  }

  // Get the real or mock aphrodite API
  _getAproditeAPI() {
    return AphroditeApi;
  }

}

let _instance = null;

export default {
  getInstance(options) {
    if (_instance === null) {
      _instance = new EBComponentFactory(options);
    }

    return _instance;
  }
};
