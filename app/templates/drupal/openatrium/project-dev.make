api = 2
core = <%= coreCompatibility %>

;;
; Build the entire Atmos Drupal codebase in "development mode".
;
; This uses the latest developments of the main Atrium distribution including
; the latest versions of all core Atrium modules checked out as Git repositories.
;;

defaults[projects][subdir] = "contrib"
defaults[projects][type] = "module"

;; Drupal Core


; Drupal core makefile might be customized per project. When using the dev snapshot
; it is critical to check routinely for changes to the core makefile in case it
; needs update. This is not done automatically.

includes[] = drupal-org-core.make

;; Open Atrium

; Unlike the stable release, the Atrium installation profile's development
; snapshot is downloaded via a custom build process that pulls down Atrium
; before Drush Make begins, then moved Atrium into place after it concludes.
;
; The copy of Atrium so retrieved is cached in build/cache and it's development
; makefile is leveraged to build out contrib dependencies via the modified grunt
; drushmake process.

;; Project-specific Dependencies

includes[] = <%= projectName %>.make
