addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);

  // 获取要代理的实际 URL
  const actualUrlStr = url.pathname.replace("/api/proxy/", "") + url.search + url.hash;
  const actualUrl = new URL(actualUrlStr);

  // 创建代理请求
  const modifiedRequest = new Request(actualUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: 'follow'
  });

  // 发送代理请求并获取响应
  const response = await fetch(modifiedRequest);

  // 创建新的响应并允许跨域访问
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');

  return modifiedResponse;
}
