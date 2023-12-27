pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner';
            }

            steps {
                echo '*** Analysis step started'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    rm -rf dist
                    rm -rf node_modules
                    echo "*** Executing analysis..."
                    ${SCANNER_HOME}/bin/sonar-scanner
                    echo "*** Terminating analysis..."
                    '''
                }
                echo '*** Analysis step done'
            }
        }

        stage('Test') {
            steps {
                echo '*** Test step started'
                /* sh '''
                echo "*** Installing project dependencies..."
                npm install
                echo "*** Executing project tests..."
                npm run test:silent
                echo "*** Terminating project tests..."
                ''' */
                echo '*** Testing step done'
            }
        }

        stage('Build') {
            steps {
                echo '*** Build step started'
                sh '''
                echo "*** Compiling project..."
                npm run build
                echo "*** Terminating compilation of project..."
                '''
                echo '*** Build step done'
            }
        }

        stage('Deploy') {
            environment {
                GOOGLE_PROJECT_ID = 'lustrous-bonito-409316';
                GCP_VERSION = '20231227';
            }
            steps {
                withCredentials([file(credentialsId: 'gcp-secret-file', variable: 'GC_KEY')]) {
                    echo '*** Deploy step started'
                    sh '''#!/bin/bash
                    echo "*** Downloading and installing GCP SDK..."
                    curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-458.0.0-linux-x86_64.tar.gz;
                    tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/;
                    /tmp/google-cloud-sdk/install.sh -q;

                    source /tmp/google-cloud-sdk/path.bash.inc;

                    echo "*** Authenticating to GCP SDK..."
                    gcloud auth activate-service-account --key-file=${GC_KEY};
                    echo "*** Configuring GCP SDK..."
                    gcloud config list;
                    gcloud config set project ${GOOGLE_PROJECT_ID};
                    echo "*** Deploying proyect..."
                    gcloud app deploy -v=${GCP_VERSION};
                    echo "*** Terminating proyect deployment..."
                    '''
                    echo '*** Deploy step done'
                }
            }
        }
    }

    post {
        always {
            echo '*** Post clean up workspace started'
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true,
                    patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                               [pattern: '.propsfile', type: 'EXCLUDE']])
            echo '*** Post clean up workspace done'
        }
    }
}
