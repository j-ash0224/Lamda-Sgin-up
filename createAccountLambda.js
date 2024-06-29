const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    console.log(requestBody.id);
    console.log(requestBody.password);
    
    try {
        let statusCode, responseBody;
        
        const params1 = {
            TableName: 'pjLastTable',
            Key: {
                'id': requestBody.id
            }
        };

        var response
        
        //사용 가능한 아이디 인지 확인
        const data1 = await dynamoDB.get(params1).promise();

        if (data1.Item) {
                    statusCode = 301
                    responseBody = '이미 사용중인 아이디'
        } else {

            const params2 = {
                TableName: 'pjLastTable',
                Item: {
                    'id': requestBody.id,
                    'password': requestBody.password
                }
            };
            
            await dynamoDB.put(params2).promise().catch(e => {
                    return {
                        statusCode: 500,
                        body: JSON.stringify('조회 중 오류가 발생했습니다.'),
                    };
            });
                return {
                    statusCode: 500,
                    body: JSON.stringify('회원가입 완료'),
                };
        }
        return {
            statusCode,
            body: JSON.stringify(responseBody),
        };

    }
    catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('회원가입 중 오류가 발생했습니다.'),
        };
    }


};