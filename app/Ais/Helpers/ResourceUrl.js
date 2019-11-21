
const getHost = () =>
{
    // Useful when you use multiple domain name
    return process.env.APP_URL;
}

const genderImage = (gender)  => 
{
    let filename = `avatar${gender}.png`;
    let path = ':host:/bower_components/admin-lte/dist/img/:image-name:';
    path = path.replace(':host:', getHost());
    path = path.replace(':image-name:', filename);

    return path;
}


module.exports = genderImage;