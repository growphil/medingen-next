const axios = require('axios');

async function checkBlog() {
  try {
    console.log("Fetching blog metadata...");
    const res = await axios.post('https://medingen.in/api/get_blog', {
      blog_url: 'vitamin-k-rich-foods'
    });
    console.log("Blog metadata status:", res.status);
    console.log("Response data type:", typeof res.data, res.data);
    const blog = Array.isArray(res.data) ? res.data[0] : res.data?.data?.[0] || res.data;
    console.log("Blog title:", blog.blog_name);
    console.log("Blog description URL:", blog.blog_description_url);
    
    if (blog.blog_description_url) {
      const descUrl = `https://d1dh0rr5xj2p49.cloudfront.net/blogs/description/${blog.blog_description_url}`;
      console.log(`Fetching blog description from ${descUrl}...`);
      const start = Date.now();
      const descRes = await axios.get(descUrl);
      console.log(`Description fetched in ${Date.now() - start}ms`);
      console.log("HTML length:", descRes.data.length);
      console.log("First 200 chars:", descRes.data.substring(0, 200));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

checkBlog();
