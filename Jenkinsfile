pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        stage('Test') {
            steps {
                echo 'Tests skipped'
            }
        }

        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner'
            }

            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy skipped'
            }
        }
    }
}
