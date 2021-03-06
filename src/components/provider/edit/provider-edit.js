import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import {
  Headline,
  Icon
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import ProxySelectField from '../../proxy-select';
import TokenField, { validate as validateToken } from '../../token';
import PaneHeaderButton from '../../pane-header-button';
import styles from './provider-edit.css';

class ProviderEdit extends Component {
  static propTypes = {
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    handleSubmit: PropTypes.func,
    intl: intlShape.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  render() {
    let {
      model,
      proxyTypes,
      rootProxy,
      handleSubmit,
      onSubmit,
      onCancel,
      pristine,
      intl,
      fullViewLink
    } = this.props;

    let supportsTokens = model.providerToken && model.providerToken.prompt;
    let hasTokenValue = model.providerToken && model.providerToken.value;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'onClick': onCancel,
        'data-test-eholdings-provider-cancel-action': true
      }
    ];

    if (fullViewLink) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: fullViewLink,
        className: styles['full-view-link']
      });
    }

    return (
      <Fragment>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DetailsView
            type="provider"
            model={model}
            key={model.id}
            paneTitle={model.name}
            actionMenuItems={actionMenuItems}
            lastMenu={(
              <Fragment>
                {model.update.isPending && (
                <Icon icon="spinner-ellipsis" />
                )}
                <PaneHeaderButton
                  disabled={pristine || model.update.isPending}
                  type="submit"
                  buttonStyle="primary"
                  data-test-eholdings-provider-save-button
                >
                  {model.update.isPending ?
                    (<FormattedMessage id="ui-eholdings.saving" />)
                    :
                    (<FormattedMessage id="ui-eholdings.save" />)}
                </PaneHeaderButton>
              </Fragment>
          )}
            bodyContent={(
              <Fragment>
                <DetailsViewSection
                  label={intl.formatMessage({ id: 'ui-eholdings.provider.providerSettings' })}
                >
                  {model.packagesSelected > 0 ? (
                    <div>
                      {(!proxyTypes.request.isResolved || !rootProxy.request.isResolved) ? (
                        <Icon icon="spinner-ellipsis" />
                      ) : (
                        <div data-test-eholdings-provider-proxy-select>
                          <ProxySelectField proxyTypes={proxyTypes} inheritedProxyId={rootProxy.data.attributes.proxyTypeId} />
                        </div>
                      )}

                      {supportsTokens && (
                        <fieldset>
                          <Headline tag="legend">
                            <FormattedMessage id="ui-eholdings.provider.token" />
                          </Headline>
                          <TokenField token={model.providerToken} tokenValue={hasTokenValue} type="provider" />
                        </fieldset>
                      )}
                    </div>
                  ) : (
                    <div data-test-eholdings-provider-package-not-selected>
                      <FormattedMessage id="ui-eholdings.provider.noPackagesSelected" />
                    </div>
                  )}
                </DetailsViewSection>
                <NavigationModal
                  modalLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.modalLabel' })}
                  continueLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.continueLabel' })}
                  dismissLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.dismissLabel' })}
                  when={!pristine && !model.update.isPending}
                />
              </Fragment>
            )}
          />
        </form>
      </Fragment>
    );
  }
}

const validate = (values, props) => {
  return validateToken(values, props);
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ProviderEdit',
  destroyOnUnmount: false,
})(ProviderEdit));
