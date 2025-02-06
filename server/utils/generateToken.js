import jwt from 'jsonwebtoken';

const generateToken = (res, user, message) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).cookie(
        "token", token, 
        { httpOnly: true,                   // it prevent to access token via client side javascript
            sameSite: 'strict',               // it prevent to send token to another site
            maxAge: 24 * 60 * 60 * 1000        // for 1 day
        }).json({
            success: true,
            message,
            user
        })
}

export default generateToken;