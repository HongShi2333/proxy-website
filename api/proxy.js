export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const actualUrlStr = url.searchParams.get('url');

    if (!actualUrlStr) {
        return new Response('URL is required', { status: 400 });
    }

    const actualUrl = new URL(actualUrlStr);
    const modifiedRequest = new Request(actualUrl, {
        headers: request.headers,
        method: request.method,
        body: request.body,
        redirect: 'follow'
    });

    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);

    // 添加允许跨域访问的响应头
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');

    return modifiedResponse;
}
