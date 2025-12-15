import UserDAO from "../dao/UserDAO.js";
import UserDTO from "../dtos/UserDTO.js";

class UserRepository {
  async createUser(userData) {
    const user = await UserDAO.create(userData);
    return UserDTO.fromUser(user);
  }

  async findUserByEmail(email) {
    const user = await UserDAO.findByEmail(email);
    return user ? UserDTO.fromUser(user) : null;
  }

  async findUserById(id) {
    const user = await UserDAO.findById(id);
    return user ? UserDTO.fromUser(user) : null;
  }

  async getAllUsers() {
    const users = await UserDAO.findAll();
    return UserDTO.fromUsers(users);
  }

  async updateUser(id, updateData) {
    const user = await UserDAO.update(id, updateData);
    return user ? UserDTO.fromUser(user) : null;
  }

  async deleteUser(id) {
    return await UserDAO.delete(id);
  }

  async updateUserPassword(id, newPassword) {
    const user = await UserDAO.updatePassword(id, newPassword);
    return user ? UserDTO.fromUser(user) : null;
  }

  async setPasswordResetToken(email, token, expires) {
    return await UserDAO.setResetToken(email, token, expires);
  }

  async findUserByResetToken(token) {
    const user = await UserDAO.findByResetToken(token);
    return user ? UserDTO.fromUser(user) : null;
  }

  async clearPasswordResetToken(id) {
    return await UserDAO.clearResetToken(id);
  }

  async updateUserRole(id, role) {
    const user = await UserDAO.updateRole(id, role);
    return user ? UserDTO.fromUser(user) : null;
  }

  async findUserByResetTokenWithPassword(token) {
    const user = await UserDAO.findByResetTokenWithPassword(token);
    return user;
  }
}

export default new UserRepository();
