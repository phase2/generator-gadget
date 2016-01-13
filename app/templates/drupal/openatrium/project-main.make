api = 2
core = <%= coreCompatibility %>

;;
; Build the entire Drupal codebase from an official Atrium release.
;;

defaults[projects][subdir] = "contrib"
defaults[projects][type] = "module"


;; Drupal Core

includes[] = drupal-org-core.make

;; Open Atrium

projects[openatrium][type] = profile
projects[openatrium][version] = "<%= drupalDistroRelease %>"
projects[openatrium][subdir] = ''

;; Project-specific Dependencies

includes[] = <%= projectName %>.make
