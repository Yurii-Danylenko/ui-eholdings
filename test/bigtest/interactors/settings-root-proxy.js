import {
  action,
  clickable,
  fillable,
  interactor,
  property,
  value
} from '@bigtest/interactor';
import Toast from './toast';

@interactor class SettingsRootProxyDropDown {
  clickDropDownButton = clickable('button');
}

@interactor class SettingsRootProxyDropDownMenu {
  clickCancel = clickable('.tether-element [data-test-eholdings-settings-root-proxy-cancel-action]');
}

@interactor class SettingsRootProxyPage {
  RootProxySelectValue = value('[data-test-eholdings-settings-root-proxy-select] select');
  chooseRootProxy = fillable('[data-test-eholdings-settings-root-proxy-select] select');
  save = clickable('[data-test-eholdings-settings-root-proxy-save-button]');
  saveButtonDisabled = property('[data-test-eholdings-settings-root-proxy-save-button]', 'disabled');

  toast = Toast;

  dropDown = new SettingsRootProxyDropDown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  dropDownMenu = new SettingsRootProxyDropDownMenu();
  clickCancel= action(function () {
    return this
      .dropDown.clickDropDownButton()
      .dropDownMenu.clickCancel();
  });
}

export default new SettingsRootProxyPage('[data-test-eholdings-settings-root-proxy]');
