const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

const controllers = () => {

    // Obtem os dados da empresa
    const obterDados = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('obterDados', 'empresa');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os dados da empresa.'
            }
        }

    }

    // Obtem os dados da empresa

const validarEmpresaAberta = async (req) => {
  try {
    const idempresa = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req.headers['authorization']);
    const sql = await readCommandSql.retornaStringSql('obterHorarios', 'horario');
    const horarios = await db.Query(sql, { idempresa, ignoreAtivo: 1 });

    if (!horarios || horarios.length === 0) {
      return { status: 'error', message: 'Estabelecimento fechado.', data: false };
    }

    const agora = new Date();
    const diaSemana = agora.getDay(); // 0..6

    // Monta lista de dias cobertos
    const listaDias = [];
    const pushDia = (e, dia) => {
      listaDias.push({
        diaSemana: dia,
        iniciohorarioum: e.iniciohorarioum,
        fimhorarioum: e.fimhorarioum,
        iniciohorariodois: e.iniciohorariodois,
        fimhorariodois: e.fimhorariodois
      });
    };

    horarios.forEach(e => {
      const ini = Number(e.diainicio);
      const fim = Number(e.diafim);
      if (ini < fim) {
        for (let d = ini; d <= fim; d++) pushDia(e, d);
      } else if (ini > fim) {
        for (let d = ini; d <= 6; d++) pushDia(e, d);
        for (let d = 0; d <= fim; d++) pushDia(e, d);
      } else {
        pushDia(e, ini);
      }
    });

    const slotHoje = listaDias.filter(x => x.diaSemana === diaSemana);
    if (slotHoje.length === 0) {
      return { status: 'error', message: 'Estabelecimento fechado.', data: false };
    }

    const pad = n => (n < 10 ? '0' + n : '' + n);
    const y = agora.getFullYear();
    const m = pad(agora.getMonth() + 1);
    const d = pad(agora.getDate());
    const now = agora.getTime();

    const toTime = str => str ? new Date(`${y}-${m}-${d} ${str}:00`).getTime() : null;

    const aberto = slotHoje.some(s => {
      const i1 = toTime(s.iniciohorarioum);
      const f1 = toTime(s.fimhorarioum);
      const i2 = toTime(s.iniciohorariodois);
      const f2 = toTime(s.fimhorariodois);

      const ok1 = (i1 != null && f1 != null && now >= i1 && now <= f1);
      const ok2 = (i2 != null && f2 != null && now >= i2 && now <= f2);
      return ok1 || ok2;
    });

    if (aberto) {
      return { status: 'success', data: true };
    }
    return { status: 'error', message: 'Estabelecimento fechado.', data: false };
  } catch (ex) {
    console.log(ex);
    return { status: 'error', message: 'Falha ao validar horário.', data: false };
  }
};


    // Obtem os dados da empresa
    const obterDadosCompletos = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('obterDadosCompletos', 'empresa');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os dados da empresa.'
            }
        }

    }

    // Salva os dados da empresa
    const salvarDadosSobre = async (req) => {

        try {

            // obtem a empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req.headers['authorization']);

            req.body.idempresa = _empresaId;

            var ComandoSQL = await readCommandSql.retornaStringSql('salvarDadosSobre', 'empresa');
            var result = await db.Query(ComandoSQL, req.body);

            console.log(result);

            return {
                status: "success",
                message: "Dados atualizados com sucesso!"
            }


        } catch (ex) {
            return {
                status: "error",
                message: "Falha ao atualizar dados. Tente novamente.",
                ex: ex
            }
        }

    }

    // Salva os dados do endereço da empresa
    const salvarDadosEndereco = async (req) => {

        try {

            // obtem a empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req.headers['authorization']);

            req.body.idempresa = _empresaId;

            var ComandoSQL = await readCommandSql.retornaStringSql('salvarDadosEndereco', 'empresa');
            var result = await db.Query(ComandoSQL, req.body);

            console.log(result);

            return {
                status: "success",
                message: "Dados atualizados com sucesso!"
            }


        } catch (ex) {
            return {
                status: "error",
                message: "Falha ao atualizar dados. Tente novamente.",
                ex: ex
            }
        }

    }

    return Object.create({
        obterDados
        , validarEmpresaAberta
        , obterDadosCompletos
        , salvarDadosSobre
        , salvarDadosEndereco
    })

}

module.exports = Object.assign({ controllers })