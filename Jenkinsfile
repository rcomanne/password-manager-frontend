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
				sh "npm run build"
				sh "rm -rf /var/www/password-manager"
				sh "cp build /var/www/password-manager"
			}
		}
	}
}