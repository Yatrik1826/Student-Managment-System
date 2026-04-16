const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ["student", "faculty", "principal"],
      required: true
    },
    studentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    department: {
      type: String,
      trim: true,
      default: ""
    },
    course: {
      type: String,
      trim: true,
      default: ""
    },
    sem: {
      type: Number,
      default: null
    },
    section: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    assignedFaculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    marksheet: {
      originalName: {
        type: String,
        default: ""
      },
      filePath: {
        type: String,
        default: ""
      },
      mimeType: {
        type: String,
        default: ""
      },
      size: {
        type: Number,
        default: 0
      },
      uploadedAt: {
        type: Date,
        default: null
      }
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const assignedFaculty =
    this.assignedFaculty && typeof this.assignedFaculty === "object" && this.assignedFaculty._id
      ? {
          id: this.assignedFaculty._id.toString(),
          fullName: this.assignedFaculty.fullName,
          email: this.assignedFaculty.email
        }
      : this.assignedFaculty
        ? this.assignedFaculty.toString()
        : null;

  const safeObject = {
    id: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };

  if (this.role === "student") {
    safeObject.studentId = this.studentId;
    safeObject.department = this.department;
    safeObject.course = this.course;
    safeObject.year= this.sem;
    safeObject.section = this.section;
    safeObject.phone = this.phone;
    safeObject.assignedFaculty = assignedFaculty;
    safeObject.marksheet = this.marksheet?.filePath
      ? {
          originalName: this.marksheet.originalName,
          mimeType: this.marksheet.mimeType,
          size: this.marksheet.size,
          uploadedAt: this.marksheet.uploadedAt
        }
      : null;
  }

  return safeObject;
};

module.exports = mongoose.model("User", userSchema);
