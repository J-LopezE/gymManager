"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Member, Membership, Discipline
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#ENDPOINT PARA REGISTRARSE

@api.route('/signup', methods=['POST'])
def signup():
    body=request.json
    user_name = body.get("user_name", None)
    password = body.get("password", None)
    profile_img_url = body.get("profile_img_url", None)
    rol = body.get("rol", None)
    number = body.get ("number", None)

    if User.query.filter_by(user_name = user_name).first() is not None:
        return jsonify({"error": "ese nombre de usuario ya esta siendo utilizado"}), 400
    if User.query.filter_by(number = number).first() is not None:
        return jsonify({"error": "ese numero de empleado ya esta siendo utilizado"}), 400
    if user_name is None or password is None or profile_img_url is None or rol is None or number is None:
        return jsonify({"error": "todos los campos son requeridos"}), 400
    password_hash = generate_password_hash(password)
    try:
        new_user = User(user_name=user_name, password=password_hash, profile_img_url=profile_img_url, rol=rol, number=number)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"mensaje": new_user.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    
#ENDPOINT PARA INICIAR SESIÓN

@api.route('/signin', methods=['POST'])
def signin():
    body=request.json
    user_name = body.get("user_name",None)
    password = body.get("password", None)
    if user_name is None or password is None:
        return jsonify({"error": "el nombre de usuario y la constraseña son requeridos"}), 400
    user = User.query.filter_by(user_name=user_name).first()
    if user is None:
        return jsonify({"error": "usuario no encontrado"}), 404
    if not check_password_hash(user.password, password):
        return jsonify({"error", "se ha producido un error al iniciar sesion, intenta nuevamente"}), 400
    user_token = create_access_token({"id": user.id, "user_name": user.user_name, "profile_img_url": user.profile_img_url, "rol": user.rol, "number": user.number })
    return jsonify({"token": user_token}), 200 

#ENDPOINT PARA OBTENER LOS DATOS DEL USUARIO LOGUEADO.

@api.route('/me', methods=['GET'])
@jwt_required()
def get_user_data():
    user_data = get_jwt_identity()
    return jsonify(user_data), 200

#ENDPOINT PARA OBTENER TODOS LOS USUARIOS (FUNCIONARIOS DEL GYM)

@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    if not users:
        return jsonify({"error": "Users not found"}), 404
    users_data = [
        {
            "id": user.id,
            "username": user.username,
            "profile_picture_url": user.profile_picture_url,
            "rol": user.rol,
            "number": user.number
        } for user in users
    ]
    return jsonify(users_data), 200

#ENDPOINT PARA CREAR MIEMBROS (QUIEN CONCURRE AL GYM)

@api.route('/create_member', methods=['POST'])
@jwt_required()
def create_member():
    body= request.json
    user_data = get_jwt_identity()
    name = body.get("name", None)
    last_name = body.get("last_name", None)
    profile_img_url = body.get("profile_img_url", None)
    blood_type = body.get("blood_type", None)
    gender = body.get("gender", None)
    birthdate = body.get("birthdate", None)
    address = body.get("address", None)
    phone = body.get("phone", None)
    emergency_phone = body.get("emergency_phone", None)
    stature = body.get("stature", None)
    weight = body.get("weight", None)
    objectives = body.get("objectives", None)
    payement_type = body.get("payement_type", None)
    refered = body.get("refered", None)
    if name is None or last_name is None or profile_img_url is None or blood_type is None or gender is None or birthdate is None or address is None or phone is None or emergency_phone is None or stature is None or weight is None or objectives is None or refered is None or payement_type is None:
        return jsonify({"error": "debe llenar todos los campos"}), 400
    try:
        new_member = Member(
        user_id = user_data["id"],
        name = name,
        last_name = last_name,
        profile_img_url = profile_img_url,
        blood_type = blood_type,
        gender = gender,
        birthdate = birthdate,
        address = address,
        phone = phone,
        emergency_phone = emergency_phone,
        stature = stature,
        weight = weight,
        objectives = objectives,
        payement_type = payement_type,
        refered = refered
    )
        db.session.add(new_member)
        db.session.commit()
        db.session.refresh(new_member)
        return jsonify({"new_member": new_member.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    
#ENDPOINT PARA OBTENER TODOS LOS MIEMBROS
    
@api.route('/members', methods=['GET'])
def get_all_members():
    members = Member.query.all()
    if not members:
        return jsonify({"error": "Aún no hay miembros"}), 404
    members_data = [
        {
            "id": member.id,
            "user_id": member.user_id,
            "name": member.name,
            "last_name": member.last_name,
            "profiel_img_url": member.profile_img_url,
            "blood_type": member.blood_type,
            "gender": member.gender,
            "birthdate": member.birthdate,
            "address": member.address,
            "phone": member.phone,
            "emergency_phone": member.emergency_phone,
            "stature": member.stature,
            "weight": member.weight,
            "objectives": member.objectives,
            "payemenet_type": member.payement_type,
            "refered": member.refered,
        } for member in members
    ]
    return jsonify(members_data), 200

#ENDPOINT PARA OBTENER LOS MIEMBROS CREADOS POR UN USUARIO
@api.route('/<int:id>/members', methods=['GET'])
def get_user_members(id):
    try: 
        user_id = id
        user = User.query.get(user_id)
        if user is None:
            return  jsonify({'error': 'usuario no encontrado'}),404
        member_list = [member.serialize() for member in user.members]
        return jsonify({"members": member_list}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    
#endpoint para editar Member REQUIERE TOKEN
@api.route('/edit_member', methods=['PUT'])
@jwt_required()
def edit_member():
    try:
        body = request.json
        user_data = get_jwt_identity()
        member_id = body.get("id")
        user_id = user_data.get("id")
        
        if not member_id or not user_id:
            return jsonify({'error': 'Missing member ID or user ID'}), 400
        
        member = Member.query.filter_by(id=member_id, user_id=user_id).first()
        if member is None:
            return jsonify({'error': 'Member no found'}), 404
                  
        member.name = body.get("name", member.name)
        member.last_name = body.get("last_name", member.last_name)
        member.profile_img_url = body.get("profile_img_url", member.profile_img_url)
        member.blood_type = body.get("blood_type", member.blood_type)
        member.gender = body.get("gender",  member.gender)
        member.birthdate = body.get("birthdate", member.birthdate)
        member.address = body.get("address", member.address)
        member.phone = body.get("phone", member.phone)
        member.emergency_phone = body.get("emergency_phone", member.emergency_phone)
        member.stature = body.get("stature", member.stature)
        member.weight = body.get("weight", member.weight)
        member.objectives = body.get("objectives", member.objectives)
        member.payement_type = body.get("payement_type", member.payement_type)
        member.refered = body.get("refered", member.refered)
        
        db.session.commit()
        
        return jsonify({"message": "Member update successfully"}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500

#Endpoint para borrar Member REQUIERE TOKEN

@api.route('/delete_member', methods=['DELETE'])
@jwt_required()
def delete_member():
    try:
        body = request.json
        user_data = get_jwt_identity()
        member_id = body.get("id", None)
        user_id = user_data.get("id")
        
        member = Member.query.filter_by(user_id= user_id, id=member_id).first()
        if member is  None:
            return jsonify({'error': 'Member no found'}), 404
        db.session.delete(member)
        db.session.commit()
        return jsonify({"message": f"Member removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    
#ENDPOINT PARA CREAR MEMBRESÍA

@api.route('/create_membership', methods=['POST'])
@jwt_required()
def create_membership():
    body = request.json
    user_data = get_jwt_identity()
    type = body.get("type", None)
    start_date = body.get("start_date", None)
    end_date= body.get("end_date", None)
    member_id = body.get("member_id", None)
    member = Member.query.filter_by(id=member_id).first()
    if member is None:
        return jsonify({"error": "miembro no encontrado"}), 404
    if type is None or start_date is None or end_date is None:
        return jsonify({"error": "todos los campos son requeridos"}), 400
    try:
        new_membership = Membership(
            user_id = user_data["id"],
            type = type,
            start_date = start_date,
            end_date = end_date,
            member_id = member_id
        )
        db.session.add(new_membership)
        db.session.commit()
        db.session.refresh(new_membership)
        return jsonify({"new_membership": new_membership.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500    

#ENDPOINT PARA OBTENER TODAS LAS MEMBRESÍAS
    
@api.route('/memberships', methods=['GET'])
def get_all_memberships():
    memberships = Membership.query.all()
    if not memberships:
        return jsonify({"error": "Aún no hay membresias"}), 404
    memberships_data = [
        {
            "id": membership.id,
            "user_id": membership.user_id,
            "type": membership.type,
            "start_date": membership.start_date,
            "end_date": membership.end_date,
            "member_id": membership.member_id,
        } for membership in memberships
    ]
    return jsonify(memberships_data), 200

#ENDPOINT PARA OBTENER LAS MEMBRESIAS DE UN MIEMBRO DETERMINADO

@api.route('/<int:id>/memberships', methods=['GET'])
def get_member_memberships(id):
    try: 
        member_id = id
        member = Member.query.get(member_id)
        if member is None:
            return  jsonify({'error': 'miembro no encontrado'}),404
        membership_list = [membership.serialize() for membership in member.memberships]
        return jsonify({"memberships": membership_list}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    
#ENDPOINT PARA CREAR DISCIPLINAS

@api.route('/create_discipline', methods=['POST'])
@jwt_required()
def create_discipline():
    body = request.json
    user_data = get_jwt_identity()
    name = body.get("name", None)
    description = body.get("description", None)
    schedule = body.get("schedule", None)
    if name is None or description is None or schedule is None:
        return jsonify({"error": "todos los campos son requeridos"}), 400
    try:
        new_discipline = Discipline(
            user_id = user_data["id"],
            name = name,
            description = description,
            schedule = schedule,
        )
        db.session.add(new_discipline)
        db.session.commit()
        db.session.refresh(new_discipline)
        return jsonify({"new_discipline": new_discipline.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500 
    
#ENDPOINT PARA OBTENER TODAS LAS DISCIPLINAS    
    
@api.route('/disciplines', methods=['GET'])
def get_all_disciplines():
    disciplines = Discipline.query.all()
    if not disciplines:
        return jsonify({"error": "Aún no hay disciplinas"}), 404
    disciplines_data = [
        {
            "id": discipline.id,
            "user_id": discipline.user_id,
            "name": discipline.name,
            "description": discipline.description,
            "schedule": discipline.schedule,
            "membersip_id": discipline.membership_id,
        } for discipline in disciplines
    ]
    return jsonify(disciplines_data), 200


#ENDPOINT PARA OBTENER LAS DISCIPLINAS DE UNA MEMBRESÍA DETERMINADA

@api.route('/<int:id>/disciplines', methods=['GET'])
def get_membership_disciplines(id):
    try: 
        membership_id = id
        membership = Membership.query.get(membership_id)
        if membership is None:
            return  jsonify({'error': 'membresia no encontrada'}),404
        disciplines_list = [discipline.serialize() for discipline in membership.disciplines]
        return jsonify({"disciplines": disciplines_list}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500

