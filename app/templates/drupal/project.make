api = 2
core = <%= coreCompatibility %>

defaults[projects][subdir] = "contrib"
defaults[projects][type] = "module"

;; Drupal Core
projects[drupal][version] = "<%= drupalDistroRelease %>"

;; Project-specific Dependencies
