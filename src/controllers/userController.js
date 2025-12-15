import UserRepository from "../repositories/UserRepository.js";

class UserController {
  async getProfile(req, res) {
    try {
      const user = await UserRepository.findUserById(req.user.id);
      res.json({
        status: "success",
        payload: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { first_name, last_name, age } = req.body;
      const updateData = {};

      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (age) updateData.age = age;

      const user = await UserRepository.updateUser(req.user.id, updateData);
      res.json({
        status: "success",
        payload: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.json({
        status: "success",
        payload: users,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserRepository.findUserById(req.params.uid);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      res.json({
        status: "success",
        payload: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      const validRoles = ["user", "premium", "admin"];

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid role",
        });
      }

      const user = await UserRepository.updateUserRole(req.params.uid, role);
      res.json({
        status: "success",
        payload: user,
        message: `User role updated to ${role}`,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      await UserRepository.deleteUser(req.params.uid);
      res.json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async uploadDocuments(req, res) {
    try {
      res.json({
        status: "success",
        message: "Documents uploaded successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      res.json({
        status: "success",
        message: "Inactive users deletion process started",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new UserController();
