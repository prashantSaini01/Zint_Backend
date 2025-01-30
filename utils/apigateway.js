// export const formatJSONResponse = (statusCode, response,token=null) => {
//     const headers =  {
//         "Access-Control-Allow-Headers": "*",
//         "Access-Control-Allow-Origin": "https://master.d2w98cujoo2tbe.amplifyapp.com",
//         "Access-Control-Allow-Methods": "*",
        
//         "Access-Control-Allow-Credentials": true,
//       }

//       if (token) {
//         headers["Set-Cookie"] = `jwt=${token}; HttpOnly; Secure; SameSite=None; Max-Age=86400; Path=/`;
//       }
//     return {
//       statusCode,
//         headers,
//         // If I simply Use Response Login Says 502 Bad Gateway
//       body: JSON.stringify(response),
//     };
//   };


  
export const formatJSONResponse = (statusCode, response, token = null) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
    "Access-Control-Allow-Origin": "https://master.d2u1ipgb07w8b3.amplifyapp.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Access-Control-Allow-Credentials": true,
  };

  if (token) {
    headers["Set-Cookie"] = `jwt=${token}; HttpOnly; Secure; SameSite=None; Max-Age=86400; Path=/`;
  }

  return {
    statusCode,
    headers,
    body: JSON.stringify(response),
  };
};
