// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
// jshint -W106
(function() {
  'use strict';

  angular
    .module('health-check', [])
    .constant('username', 'bigstickcarpet')
    .controller('ProjectListController', ProjectListController);

  ProjectListController.$inject = ['$http', '$q', '$log', 'username'];

  function ProjectListController($http, $q, $log, username) {
    var vm = this;
    vm.projects = [];
    vm.hasOutdatedProjects = false;
    vm.hasProjectsWithIssues = false;
    vm.isOutdated = isOutdated;
    vm.hasIssues = hasIssues;

    activate();

    function activate() {
      getProjects()
        .then(getDependencies)
        .then(calculateStats)
        .catch($log.error);
    }

    /**
     * Gets the list of projects from GitHub.
     *
     * @returns {Promise}
     */
    function getProjects() {
      return $http.get('https://api.github.com/users/' + username + '/repos')
        .success(function(projects) {
          $log.debug('All GitHub Projects', projects.length, projects);

          // Only return projects that belong to us (not forks)
          // and that are probably on NPM (JavaScript)
          vm.projects = projects.filter(function(project) {
            return !project.fork && project.language === 'JavaScript';
          });

          $log.debug('Filtered Projects', vm.projects.length, vm.projects);
        });
    }

    /**
     * Gets the dependency data for each project from David-DM.
     *
     * @returns {Promise}
     */
    function getDependencies() {
      return $q.all(vm.projects.map(function(project) {
        return $http.get('https://david-dm.org/' + username + '/' + project.name + '/info.json')
          .success(function(deps) {
            $log.debug(project.name + ' dependencies', deps);
            angular.extend(project, deps);
            project.totals.html_url = 'https://david-dm.org/' + username + '/' + project.name + '/';
          });
      }));
    }

    /**
     * Calculates stats for each project, and for all projects.
     */
    function calculateStats() {
      vm.projects.forEach(function(project) {
        project.popularity = project.forks_count + project.stargazers_count + project.watchers_count;
        vm.hasOutdatedProjects = vm.hasOutdatedProjects || isOutdated(project);
        vm.hasProjectsWithIssues = vm.hasProjectsWithIssues || hasIssues(project);
      });
    }

    /**
     * Are the project's dependencies outdated?
     *
     * @param {object} project
     * @returns {boolean}
     */
    function isOutdated(project) {
      return project.totals && project.totals.outOfDate > 0;
    }

    /**
     * Does the project have open issues?
     *
     * @param {object} project
     * @returns {boolean}
     */
    function hasIssues(project) {
      return project.open_issues_count > 0;
    }
  }

})();

