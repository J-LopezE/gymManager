from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    profile_img_url = db.Column(db.String(120), unique=False, nullable=False)
    rol = db.Column(db.String(120), unique=False, nullable=False)
    number = db.Column(db.Integer, unique=True, nullable=False)

    memberships = db.relationship('Membership', backref='creator', lazy=True)
    members = db.relationship('Member', backref='creator', lazy=True)


    def __repr__(self):
        return f'<User {self.user_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "rol": self.rol,
            "number": self.number,
        }
    

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    profile_img_url = db.Column(db.String(120), unique=False, nullable=False)
    blood_type = db.Column(db.String(120), unique=False, nullable=False)
    gender = db.Column(db.String(120), unique=False, nullable=False)
    birthdate = db.Column(db.String(120), unique=False, nullable=False)
    address = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.Integer, unique=False, nullable=False)
    emergency_phone = db.Column(db.Integer, unique=False, nullable=False)
    stature = db.Column(db.String(120), unique=False, nullable=False)
    weight = db.Column(db.String(120), unique=False, nullable=False)
    objectives = db.Column(db.String(250), unique=False, nullable=False)
    payement_type = db.Column(db.String(120), unique=False, nullable=False)
    refered = db.Column(db.String(120), unique=False, nullable=False)

    memberships = db.relationship('Membership', backref='member', lazy=True)

    
    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "last_name": self.last_name,
            "profiel_img_url": self.profile_img_url,
            "blood_type": self.blood_type,
            "gender": self.gender,
            "birthdate": self.birthdate,
            "address": self.address,
            "phone": self.phone,
            "emergency_phone": self.emergency_phone,
            "stature": self.stature,
            "weight": self.weight,
            "objectives": self.objectives,
            "payemenet_type": self.payement_type,
            "refered": self.refered,
        }
    

class Membership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(120), unique=False, nullable=False)
    start_date = db.Column(db.String(120), unique=False, nullable=False)
    end_date = db.Column(db.String(120), unique=False, nullable=False)

    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    disciplines = db.relationship('Discipline', backref='membership', lazy=True)


    def __repr__(self):
        return f'<User {self.type}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "member_id": self.member_id,
        }
    
class Discipline(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    schedule = db.Column(db.String(80), unique=False, nullable=False)

    membership_id = db.Column(db.Integer, db.ForeignKey('membership.id'), nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "schedule": self.schedule,
            "membersip_id": self.membership_id,
        }