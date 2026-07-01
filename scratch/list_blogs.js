const axios = require('axios');

async function listBlogs() {
  try {
    console.log("Fetching all blogs...");
    const res = await axios.get('https://medingen.in/api/all_blogs');
    console.log("Status:", res.status);
    const blogs = Array.isArray(res.data) ? res.data : res.data.blogs || [];
    console.log(`Found ${blogs.length} blogs:`);
    blogs.forEach((b, idx) => {
      console.log(`${idx + 1}. Title: "${b.blog_name}", URL: "${b.blog_url}"`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

listBlogs();
