pipeline {
	agent any

	options {
	    disableConcurrentBuilds()
	    buildDiscarder(logRotator(numToKeepStr: '10'))
	    ansiColor(colorMapName: 'XTerm')
	}

	triggers {
		githubPush()
	}

	tools {
		jdk 'jdk-11'
		maven 'mvn'
	}

	stages {
		stage('Build') {
			steps {
			    sh 'npm install'
			}
		}

		stage('Deploy') {
			when {
				branch 'master'
			}
			steps {
				dir ("/var/www/password-manager-frontend") {
					sh "git pull"
					sh "npm install"
					sh "npm run build"
				}
			}
		}
	}
}