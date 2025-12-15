import userModel from "../models/userModel.js";

class UserDAO {
  async create(userData) {
    return await userModel.create(userData);
  }

  async findByEmail(email) {
    return await userModel.findOne({ email });
  }

  async findById(id) {
    return await userModel.findById(id).populate("cart");
  }

  async update(id, updateData) {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id);
  }

  async findAll() {
    return await userModel.find().select("-password");
  }

  async updatePassword(id, newPassword) {
    return await userModel.findByIdAndUpdate(
      id,
      { password: newPassword },
      { new: true }
    );
  }

  async setResetToken(email, token, expires) {
    return await userModel.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
      { new: true }
    );
  }

  async findByResetToken(token) {
    return await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  async clearResetToken(id) {
    return await userModel.findByIdAndUpdate(
      id,
      {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );
  }

  async updateRole(id, role) {
    return await userModel.findByIdAndUpdate(id, { role }, { new: true });
  }

  async findByResetTokenWithPassword(token) {
    return await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
}

export default new UserDAO();
