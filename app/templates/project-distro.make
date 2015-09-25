api = 2
core = <%= coreCompatibility %>

defaults[projects][subdir] = "contrib"
defaults[projects][type] = "module"

;; Drupal Core
includes[] = drupal-org-core.make

;; Open Atrium
projects[<%= drupalDistroName %>][type] = profile
projects[<%= drupalDistroName %>][version] = "<%= drupalDistroRelease %>"
projects[<%= drupalDistroName %>][subdir] = ''

;; Project-specific Dependencies

