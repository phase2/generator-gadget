core = <%= coreCompatibility %>
api = 2

; Drupal Core
projects[drupal][version] = "<%= drupalCoreRelease %>"

; =====================================
; Contrib Modules
; =====================================

; By default, store all contrib modules in the "contrib" subdirectory of the
; modules directory.
defaults[projects][subdir] = "contrib"
