import {
  clickable,
  interactor,
  value,
  fillable,
  text,
  triggerable,
  blurrable
} from '@bigtest/interactor';
import { hasClassBeginningWith } from './helpers';

export default @interactor class Datepicker {
  inputValue = value('input');
  clickInput = clickable('input');
  fillInput = fillable('input');
  blurInput = blurrable('input');
  clearInput = clickable('button[id^=datepicker-clear-button]');
  pressEnter = triggerable('input', 'keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });

  isValid = hasClassBeginningWith('input', 'feedbackValid--');
  isInvalid = hasClassBeginningWith('input', 'feedbackError--');
  isChanged = hasClassBeginningWith('input', 'feedbackChanged--');
  validationError = text('div[class^=feedback]');

  fillAndBlur(date) {
    return this
      .clickInput()
      .fillInput(date)
      .pressEnter()
      .blurInput();
  }

  fillAndClear(date) {
    return this
      .fillAndBlur(date)
      .clearInput()
      .blurInput();
  }
}
