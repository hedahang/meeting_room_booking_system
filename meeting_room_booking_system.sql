/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 80100
 Source Host           : localhost:3306
 Source Schema         : meeting_room_booking_system

 Target Server Type    : MySQL
 Target Server Version : 80100
 File Encoding         : 65001

 Date: 28/09/2025 18:01:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限名称',
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限代码',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (1, 'ccc', 'ccc', '访问 ccc 接口');
INSERT INTO `permissions` VALUES (2, 'ddd', 'ddd', '访问 ddd 接口');

-- ----------------------------
-- Table structure for role_permissions
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions`  (
  `rolesId` int NOT NULL,
  `permissionsId` int NOT NULL,
  PRIMARY KEY (`rolesId`, `permissionsId`) USING BTREE,
  INDEX `IDX_0cb93c5877d37e954e2aa59e52`(`rolesId` ASC) USING BTREE,
  INDEX `IDX_d422dabc78ff74a8dab6583da0`(`permissionsId` ASC) USING BTREE,
  CONSTRAINT `FK_0cb93c5877d37e954e2aa59e52c` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d422dabc78ff74a8dab6583da02` FOREIGN KEY (`permissionsId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
INSERT INTO `role_permissions` VALUES (1, 1);
INSERT INTO `role_permissions` VALUES (1, 2);
INSERT INTO `role_permissions` VALUES (2, 1);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '管理员');
INSERT INTO `roles` VALUES (2, '普通用户');

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `usersId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`usersId`, `rolesId`) USING BTREE,
  INDEX `IDX_99b019339f52c63ae615358738`(`usersId` ASC) USING BTREE,
  INDEX `IDX_13380e7efec83468d73fc37938`(`rolesId` ASC) USING BTREE,
  CONSTRAINT `FK_13380e7efec83468d73fc37938e` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_99b019339f52c63ae6153587380` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (3, 1);
INSERT INTO `user_roles` VALUES (4, 2);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `nick_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `headPic` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `phoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `isFrozen` tinyint NOT NULL DEFAULT 0 COMMENT '是否冻结',
  `isAdmin` tinyint NOT NULL DEFAULT 0 COMMENT '是否是管理员',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'guang', 'e3ceb5881a0a1fdaad01296d7554868d', '测试', 'xxxx@qq.com', NULL, NULL, 0, 0, '2025-09-28 16:17:33.065102', '2025-09-28 16:17:33.065102');
INSERT INTO `users` VALUES (2, 'guang2', 'e3ceb5881a0a1fdaad01296d7554868d', '测试', 'xxxx@qq.com', NULL, NULL, 0, 0, '2025-09-28 17:19:03.461520', '2025-09-28 17:19:03.461520');
INSERT INTO `users` VALUES (3, 'zhangsan', '96e79218965eb72c92a549dd5a330112', '张三', 'xxx@xx.com', NULL, '13233323333', 0, 1, '2025-09-28 17:24:12.579373', '2025-09-28 17:24:12.579373');
INSERT INTO `users` VALUES (4, 'lisi', 'e3ceb5881a0a1fdaad01296d7554868d', '李四', 'yy@yy.com', NULL, NULL, 0, 0, '2025-09-28 17:24:12.593360', '2025-09-28 17:24:12.593360');

SET FOREIGN_KEY_CHECKS = 1;
