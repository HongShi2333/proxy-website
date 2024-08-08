export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const actualUrl = url.searchParams.get('url');

  if (!actualUrl) {
    return new Response('缺少目标 URL', { status: 400 });
  }

  try {
    const response = await fetch(actualUrl, {
      redirect: 'follow'
    });

    // 获取响应内容类型
    const contentType = response.headers.get('Content-Type');

    // 根据内容类型返回不同的响应
    if (contentType && contentType.includes('text/html')) {
      // 如果是 HTML，直接返回
      return new Response(response.body, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          ...response.headers,
        },
      });
    } else {
      // 如果是其他类型，返回数据 URL
      const blob = await response.blob();
      const dataUrl = `data:${contentType};base64,${btoa(await blob.text())}`;
      return new Response(JSON.stringify({ dataUrl }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    console.error('代理请求出错:', error);
    return new Response('代理请求出错', { status: 500 });
  }
}
