// ─────────────────────────────────────────────────────────────────────────
// Mavuti Health Platform — Jenkinsfile
//
// Used for on-premises Jenkins pipelines (e.g. VUT lab environment).
// GitHub Actions (ci-cd.yml) is the primary pipeline for Render.com.
// ─────────────────────────────────────────────────────────────────────────

pipeline {
    agent any

    tools {
        jdk 'JDK-21'
        maven 'Maven-3.9'
        nodejs 'Node-22'
    }

    environment {
        REGISTRY        = 'ghcr.io'
        BACKEND_IMAGE   = "${REGISTRY}/${env.GITHUB_REPO}/mavuti-backend"
        FRONTEND_IMAGE  = "${REGISTRY}/${env.GITHUB_REPO}/mavuti-frontend"
        DOCKER_CREDS    = credentials('github-container-registry')
        RENDER_API_KEY  = credentials('render-api-key')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Backend — Test') {
            steps {
                dir('backend') {
                    sh 'mvn -B clean verify -DskipTests=false'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/target/site/jacoco',
                        reportFiles: 'index.html',
                        reportName: 'JaCoCo Coverage'
                    ])
                }
            }
        }

        stage('Frontend — Build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker — Backend') {
            when { branch 'main' }
            steps {
                sh """
                    echo ${DOCKER_CREDS_PSW} | docker login ${REGISTRY} \
                        -u ${DOCKER_CREDS_USR} --password-stdin
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                                 -t ${BACKEND_IMAGE}:latest backend/
                    docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${BACKEND_IMAGE}:latest
                """
            }
        }

        stage('Docker — Frontend') {
            when { branch 'main' }
            steps {
                sh """
                    docker build \
                        --build-arg VITE_API_BASE_URL=https://mavuti-api.onrender.com/api/v1 \
                        -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${FRONTEND_IMAGE}:latest frontend/
                    docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${FRONTEND_IMAGE}:latest
                """
            }
        }

        stage('Deploy — Render') {
            when { branch 'main' }
            steps {
                sh """
                    curl -s -X POST \
                        -H "Authorization: Bearer ${RENDER_API_KEY}" \
                        -H "Content-Type: application/json" \
                        "https://api.render.com/v1/services/${RENDER_BACKEND_SVC}/deploys" -d '{}'

                    curl -s -X POST \
                        -H "Authorization: Bearer ${RENDER_API_KEY}" \
                        -H "Content-Type: application/json" \
                        "https://api.render.com/v1/services/${RENDER_FRONTEND_SVC}/deploys" -d '{}'
                """
            }
        }

        stage('Smoke Test') {
            when { branch 'main' }
            steps {
                sh '''
                    echo "Waiting for Render cold start..."
                    sleep 60
                    STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
                        https://mavuti-api.onrender.com/actuator/health)
                    if [ "$STATUS" != "200" ]; then
                        echo "FAILED — health check returned HTTP $STATUS"
                        exit 1
                    fi
                    echo "Health check passed — HTTP $STATUS"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline succeeded — build ${BUILD_NUMBER} deployed to Render."
        }
        failure {
            echo "❌ Pipeline failed — check the logs above."
            // emailext(
            //     subject: "FAILED: Mavuti build ${BUILD_NUMBER}",
            //     body: "See ${BUILD_URL}",
            //     to: 'devteam@vut.ac.za'
            // )
        }
        cleanup {
            sh 'docker image prune -f || true'
        }
    }
}
