var { Seeder } = require('mongoose-data-seed');
var faker = require('faker');
const {ObjectId} = require('mongodb'); // or ObjectID
const Model = require("../../models/UserModel").User;
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');

let data = [];

class UsersSeeder extends Seeder {

    async shouldRun() {
        // Ini berjalan apabila data kosong
        return Model.deleteMany({}).exec();
    }
  
    async run() {
        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);

        let count = 16;
        let parent = [];
        let divided = parseInt(count) / 2;
        let b = 0;

        data.push({
            _id: ObjectId(),
            username: 'admin',
            full_name: 'Muhammad Bestari',
            gender: '1',
            email: 'ibez11@gmail.com',
            level: '',
            address: 'Jalan Hang Jebat 1 No 9',
            role_type: 2,
            password: "$2b$06$fsx8EC4EmhLL8CDCBFAnkuEP0sj9lR2w4MSZWl9oioFPkksdldINW",
            is_actived: true,
            approved: true,
            created_at: now
        },{
            _id: ObjectId(),
            username: 'operator',
            full_name: 'Operator',
            gender: '1',
            email: 'operator@gmail.com',
            level: '',
            address: 'Jalan Hang Jebat 1 No 9',
            role_type: 4,
            password: "$2b$06$fsx8EC4EmhLL8CDCBFAnkuEP0sj9lR2w4MSZWl9oioFPkksdldINW",
            is_actived: true,
            approved: true,
            created_at: now
        })

        for(let i=1; i<=count;i++) {
            let objectId = ObjectId();
            
            var randomName = faker.name.findName();
            var randomUsername = faker.internet.userName();
            var randomEmail = faker.internet.email();
            var randomAddress = faker.address.streetAddress();
            
            if(i <= divided) {
                parent.push(objectId);
            } else {
                b++;
            }

            data.push({
                _id: objectId,
                username: randomUsername,
                full_name: randomName,
                gender: Math.floor(Math.random() * 2) + 1,
                email: randomEmail,
                address: randomAddress,
                level: '',
                role_type: '6',
                user_id_parent: parent[b - 1],
                password: "$2b$06$fsx8EC4EmhLL8CDCBFAnkuEP0sj9lR2w4MSZWl9oioFPkksdldINW",
                is_actived: true,
                approved: true,
                created_at: now
            })
        }
        
        return Model.create(data);
    }
}

module.exports = UsersSeeder;