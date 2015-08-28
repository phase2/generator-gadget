api = 2
core = <%= coreCompatibility %>

; Drupal Core
projects[drupal][version] = "<%= drupalDistroRelease %>"

; =====================================
; Contrib Modules
; =====================================

; By default, store all contrib modules in the "contrib" subdirectory of the
; modules directory.
defaults[projects][subdir] = "contrib"
