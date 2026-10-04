pipeline{
    agent any

    environment{
        IMAGE = "bg-demo"
        TAG = "${env.BUILD_NUMBER}"
    }
    stages{
        stage('Checkout')
        {
            steps{
                checkout scm
            }
        }
        stage('Build image')
        {
            steps{
                bat 'docker build -t %IMAGE%:%TAG% .'
            }
        }
        stage('Find idle color')
        {
            steps{
                script{
                    def odd = (env.BUILD_NUMBER.toInteger() % 2 == 1)
                    env.IDLE = odd ? 'blue' : 'green'
                    env.IDLE_PORT = odd ? '3001' : '3002'
                }
            }
        }

        stage('Deploy to idle')
        {
            steps{
                bat '''
                    docker rm -f %IDLE%
                    docker run -d --network bgnet2 -p %IDLE_PORT%:3000 -e APP_COLOR=%IDLE% -e APP_VERSION=%TAG% --name %IDLE% %IMAGE%:%TAG%
                    '''
            }
        }

        stage('Health check') {
        steps {
            retry(10) {
            sleep 2
            bat 'curl.exe -f -s http://localhost:%IDLE_PORT%/status'
            }
      }
    }

    stage('Switch traffic') {
      steps {
        bat '''
          docker cp nginx/%IDLE%.conf nginx:/etc/nginx/conf.d/default.conf
          docker exec nginx nginx -s reload
        '''
      }
    }

    stage('Verify live') {
      steps {
        bat 'curl.exe -f -s http://localhost:8081/status'
      }
    }
    }
}