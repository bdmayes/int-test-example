pipeline {

  // do we want an agent here? If not just use "agent any"
  agent {
    label 'some-build-machine'
  }

  options {
    // keep 5 logs around
    buildDiscarder(logRotator(numToKeepStr: '5'))
    // in case you want to prevent concurrent builds on the same branch
    disableConcurrentBuilds()
  }

  stages {
    // TODO: Maybe send a slack notification to a channel to indicate that a build has started?
    // see https://jenkins.io/doc/pipeline/examples/
    stage('Slack notification') {
      // TODO: Put the following slack block into a reusable shared library
      // See https://jenkins.io/doc/book/pipeline/shared-libraries/
    }

    // build a new Docker image that can be tested against and ultimately released
    stage('Docker build') {
      steps {
        script {
          def repoName = 'your-org-repo-name';

          // TODO: maybe there is a way to dynamically insert the github repo name here?
          def containerName = 'int-test-example'

          // TODO: move this tag formation stuff into a shared library
          def releaseDateFormat = new SimpleDateFormat('yyyy.MM.dd');
          def buildNum = env.BUILD_NUMBER;
          def branchName = env.BRANCH_NAME;

          // append a (safely escaped) branch name to the tag unless it's master
          if (branchName != 'master') {
            buildNum += '-' + branchName.replaceAll('/', '-');
          }

          def containerTag = releaseDateFormat.format(new Date()) + '-' + buildNum
        }

        sh "docker build -t ${containerName} -f Dockerfile ."
      }
    }

    stage('Test') {
      steps {
        withCredentials([
          string(
            credentialsId: 'docker-registry',
            variable: 'DOCKER_REGISTRY'
          ),
          usernamePassword(
            credentialsId: 'docker-user-pass',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )
        ]) {
          script {
            try {
              sh 'make install-ci'
              sh 'make test-ci'
            } finally {
              // Just in case something went wrong, let's be certain to clean up our mess.
              sh 'make down-test-ci'
            }
          }
        }
      }
    }

    stage('Release') {
      // TODO: put this into a shared library and call it from here

      // Assume we store some Jenkins credentials with the values we need. Please do not
      // commit credentials to git, especially for staging and/or prod environments.
      withCredentials([
        string(
          credentialsId: 'docker-registry',
          variable: 'DOCKER_REGISTRY' // something like privatedocker.registry.url
        ),
        usernamePassword(
          credentialsId: 'docker-user-pass',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )
      ]) {
        script {
          def imageURI = "${DOCKER_REGISTRY}/${repoName}/${containerName}";

          // You could also read from stdin or use a credentials store. For more info and examples
          // see https://docs.docker.com/engine/reference/commandline/login/
          sh "docker login https://${DOCKER_REGISTRY} -u ${DOCKER_USER} -p ${DOCKER_PASS}"
          sh "docker tag ${containerName} ${imageURI}:${containerTag}"
          sh "docker push ${imageURI}:${containerTag}"
          sh "docker logout https://${DOCKER_REGISTRY}"
        }
      }
    }

    // Deploy our new container into staging if the branch name is "staging", or deploy to prod
    // if the branch name is "master". Otherwise, we won't deploy at all and the following two
    // stages will simply be skipped.
    stage('Staging Deploy') {
      agent {
        label 'staging'
      }

      when {
        beforeAgent true
        branch 'staging'
      }
      steps {
        // TODO: Put the following login and logout code into a reusable shared library

        // Assume we store some Jenkins credentials with the values we need. Please do not
        // commit credentials to git, especially for staging and/or prod environments.
        withCredentials([
          string(
            credentialsId: 'docker-registry',
            variable: 'DOCKER_REGISTRY' // something like privatedocker.registry.url
          ),
          usernamePassword(
            credentialsId: 'docker-user-pass',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )
        ]) {
          script {
            // You could also read from stdin or use a credentials store. For more info and examples
            // see https://docs.docker.com/engine/reference/commandline/login/
            sh "docker login https://${DOCKER_REGISTRY} -u ${DOCKER_USER} -p ${DOCKER_PASS}"
            // TODO: issue some deploy command here whether you're using kubernetes, swarm, ECS, etc.
            sh "docker logout https://${DOCKER_REGISTRY}"
          }
        }
      }
    }

    stage('Production Deploy') {
      agent {
        label 'prod'
      }

      when {
        beforeAgent true
        branch 'master'
      }
      steps {
        // TODO: Put the following login and logout code into a reusable shared library

        // Assume we store some Jenkins credentials with the values we need. Please do not
        // commit credentials to git, especially for staging and/or prod environments.
        withCredentials([
          string(
            credentialsId: 'docker-registry',
            variable: 'DOCKER_REGISTRY' // something like privatedocker.registry.url
          ),
          usernamePassword(
            credentialsId: 'docker-user-pass',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )
        ]) {
          script {
            // You could also read from stdin or use a credentials store. For more info and examples
            // see https://docs.docker.com/engine/reference/commandline/login/
            sh "docker login https://${DOCKER_REGISTRY} -u ${DOCKER_USER} -p ${DOCKER_PASS}"
            // TODO: issue some deploy command here whether you're using kubernetes, swarm, ECS, etc.
            sh "docker logout https://${DOCKER_REGISTRY}"
          }
        }
      }
    }
  }

  // TODO: Send a slack notification to indicate success/failure of the job.
  post {
    failure {
      // TODO
    }

    success {
      // TODO
    }
  }
}