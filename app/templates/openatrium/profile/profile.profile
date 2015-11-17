<?php
/**
 * @file
 * Defines install profile for <%= title %> based on Open Atrium.
 */

require_once 'profiles/openatrium/openatrium.profile';

/**
 * Implements hook_apps_servers_info().
 */
function <%= machineName %>_apps_servers_info() {
  return openatrium_apps_servers_info();
}

/**
 * Implements hook_form_FORM_ID_alter() for install_configure_form.
 */
function <%= machineName %>_form_install_configure_form_alter(&$form, &$form_state) {
  openatrium_form_install_configure_form_alter($form, $form_state);
}

/**
 * Implements hook_form_FORM_ID_alter() for panopoly_theme_selection_form.
 */
function <%= machineName %>_form_panopoly_theme_selection_form_alter(&$form, &$form_state, $form_id) {
  openatrium_form_panopoly_theme_selection_form_alter($form, $form_state, $form_id);
}
