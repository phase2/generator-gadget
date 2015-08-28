api = 2
core = <%= coreCompatibility %>

defaults[projects][subdir] = "contrib"

;********** Drupal Core **********
;*********************************
includes[] = drupal-org-core.make

;********** Open Atrium **********
;*********************************
projects[openatrium][type] = profile
projects[openatrium][version] = "<%= drupalDistroRelease %>"
projects[openatrium][subdir] = ''
