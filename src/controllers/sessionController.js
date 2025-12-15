import UserRepository from "../repositories/UserRepository.js";
import EmailService from "../services/emailService.js";
import {
  generateToken,
  generateResetToken,
  createHash,
  isValidPassword,
} from "../utils.js";

class SessionController {
  async register(req, res) {
    try {
      const user = await UserRepository.createUser(req.user);
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const token = generateToken(req.user);

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        status: "success",
        message: "Login successful",
        token,
        user: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async current(req, res) {
    try {
      const userDTO = {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart,
        last_connection: req.user.last_connection,
      };

      res.json({
        status: "success",
        payload: userDTO,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    res.clearCookie("jwt");
    res.json({
      status: "success",
      message: "Logout successful",
    });
  }

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const user = await UserRepository.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      const resetToken = generateResetToken();
      const resetExpires = Date.now() + 3600000;

      await UserRepository.setPasswordResetToken(
        email,
        resetToken,
        resetExpires
      );

      const emailSent = await EmailService.sendPasswordResetEmail(
        email,
        resetToken
      );

      if (emailSent) {
        res.json({
          status: "success",
          message: "Password reset email sent",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to send email",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const user = await UserRepository.findUserByResetTokenWithPassword(token);

      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Invalid or expired token",
        });
      }

      if (isValidPassword(user, newPassword)) {
        return res.status(400).json({
          status: "error",
          message: "New password cannot be the same as the old one",
        });
      }

      const hashedPassword = createHash(newPassword);
      await UserRepository.updateUserPassword(user._id, hashedPassword);
      await UserRepository.clearPasswordResetToken(user._id);

      res.json({
        status: "success",
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new SessionController();
