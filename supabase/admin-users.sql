-- Directory access allowlist for davidstemple.app.
-- Safe to rerun. Existing emails will have their role updated.
-- Roles: owner, admin, leader, member.

insert into public.admin_users (email, role)
values
  ('keithshouldersjr@gmail.com', 'owner'),
  ('donald.wicks@gmail.com', 'admin'),
  ('jenniferwicks24@gmail.com', 'admin'),
  ('shellia@bellsouth.net', 'admin'),
  ('mdtax1992@comcast.net', 'admin'),
  ('jerri1947@aol.com', 'admin'),
  ('ladyengr1@att.net', 'admin'),
  ('mauricepryor3@gmail.com', 'admin'),
  ('pryorstephanie2@gmail.com', 'admin'),
  ('sydney1alexandra@gmail.com', 'admin'),
  ('taranicole_rn@yahoo.com', 'admin'),
  ('sykescynthia729@gmail.com', 'admin'),
  ('charlesshoulders@aol.com', 'admin'),
  ('nicoleandrews092813@gmail.com', 'admin'),
  ('jabo9828@gmail.com', 'admin'),
  ('kejaunwright@gmail.com', 'admin')
on conflict (email) do update set
  role = excluded.role;
