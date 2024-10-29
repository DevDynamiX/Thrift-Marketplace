import { DataSource } from 'typeorm';
import { UserRole } from '../../core/entity/UserRole';

export async function seedRoles(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(UserRole);
    const predefinedRoles = ["Admin", "User"];

    for (const roleName of predefinedRoles) {
        const roleExists = await roleRepository.findOne({ where: { name: roleName } });

        if (!roleExists) {
            const newRole = roleRepository.create({ name: roleName });
            await roleRepository.save(newRole);
            console.log(`Role '${roleName}' has been added.`);
        }
    }
}