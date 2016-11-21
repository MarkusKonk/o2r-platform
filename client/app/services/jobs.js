(function(){
    'use strict';

    angular
        .module('starter')
        .factory('jobs', jobs);
        
    jobs.$inject = ['$rootScope', '$log', 'httpRequests'];
    
    function jobs($rootScope, $log, httpRequests){
        var executionStatus = {};
        var jobDone = true;

        var service = {
            callJobs: callJobs,
            getJobStatus: getJobStatus,
            executeJob: executeJob,
            getExecStatus: getExecStatus,
            getJobDone: getJobDone
        };

        return service;

        /////////////

        /*
        * @Desc httpRequest for getting information about a job status
        * @Param id, id of compendium
        */
        function callJobs(id){
            httpRequests
                .listJobs({'compendium_id': id})
                .then(callback1)
                .then(callback2)
                .catch(errorHandler);
            
            function callback1(joblist){
                $log.debug('in callJobs callback1: %o', joblist);
                return httpRequests.listSingleJob(joblist.data.results[joblist.data.results.length-1]);
            }
            function callback2(job){
                $log.debug('in callJobs callback2: %o', job);
                setExecStatus(job.data.steps);
                getJobStatus(job.data.steps);
            }
            function errorHandler(e){
                $log.debug('in callJobs errorHandler: %o', e);
                //overwrite execStatus with empty object
                setExecStatus({});
                setJobDone(true);
            }
        }

        /*
        * @Desc getting job status and checking if execution succeeded or failed
        * @Param status, object containing status information
        */
        function getJobStatus(status){
            if(_checkStatus(status)){
                setJobDone(true);
            } else {
                setJobDone(false);
            }

            function _checkStatus(object){
                var allSuccess = true;
                var oneFail = false;
                for(var step in object){
                    if(object[step].status != 'success') allSuccess = false;
                    if(object[step].status == 'failure') oneFail = true;
                }
                if(allSuccess) return true;
                if(oneFail) return true;
                return false;
            }
        }

        /*
        * @Desc executes a new job
        * @Param id, id of compendium
        */
        function executeJob(id){
            httpRequests.newJob({'compendium_id': id})
                .then(callback1)
                .then(callback2)
                .catch(errorHandler);

            function callback1(response){
                $log.debug('executeJob callback1: %o', response);
                return httpRequests.listSingleJob(response.data.job_id);
                //(res) => {getJobStatus(res.steps);});
            }
            function callback2(job){
                $log.debug('executeJob callback2: %o', job);
                getJobStatus(job.data.steps);
            }
            function errorHandler(e){
                $log.debug('executeJob errorHandler: %o', e);
            }
        }


        function getExecStatus(){
            return executionStatus;
        }

        function getJobDone(){
            return jobDone;
        }

        function setExecStatus(status){
            executionStatus = status;
            $rootScope.$broadcast('changedExecStatus');
        }

        function setJobDone(bool){
            jobDone = bool;
            $rootScope.$broadcast('changedJobDone');
        }
    }
})();