

const client_id = process.env.GITHUB_CLIENT_ID;
const redirect_uri = process.env.GITHUB_REDIRECT_URI;
const client_secret =  process.env.GITHUB_CLIENT_SECRET;

export const fetchUserFromGithub = async(code) => {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code,
            redirect_uri
        })
    });
    const tokenData =  await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/vnd.github+json"
        }
    });
    const userData = await userResponse.json();
    return {
        name: userData.name || userData.login,
        email: userData.email,
        picture: userData.avatar_url
    };
}