//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Actions
//

import axios from 'axios';
import AppConstants from './../utils/AppConstants';

// ------------
// Action Types
// ------------
export const FETCH_FS = 'FETCH_FS';
export const POST_ANONYMIZE = 'POST_ANONYMIZE';

export const fetchFsData = () => {
  return async(dispatch) => {
    const query = {
      entity_type: 'file_server_service',
      group_member_sort_attribute: 'name',
      group_member_sort_order: 'ASCENDING',
      group_member_offset: 0,
      group_member_attributes: [
        {
          attribute: 'name'
        },
        {
          attribute: 'cluster'
        },
        {
          attribute: 'nvm_uuid_list'
        },
        {
          attribute: 'afs_version'
        },
        {
          attribute: 'cluster_uuid'
        }
      ]
    };
    const resp = await axios.post(AppConstants.APIS.GROUPS_API, query);

    dispatch({
      type: FETCH_FS,
      payload: resp.data
    });
  };
};

export const postAnonymize = (payload) => {
  return async(dispatch) => {
    const resp = await axios.post(AppConstants.APIS.ANONYMIZE_API, payload);

    dispatch({
      type: POST_ANONYMIZE,
      payload: resp
    });
  };
};
