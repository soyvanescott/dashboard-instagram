module.exports = (_req, res) => {
  res.setHeader('Content-Type','application/json');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify({configured:false,userId:null,supabaseUrl:null,supabaseAnonKey:null}));
};
