import { RomanticContentConfig } from '../types/romantic';

/**
 * ==============================================================================
 * CONFIGURAÇÃO DE CONTEÚDO EDITÁVEL
 * ==============================================================================
 * Edite aqui os textos, caminhos de fotos e faixas de áudio.
 * 
 * FOTOGRAFIAS: Adicione em public/images/
 * MÚSICAS: Adicione em public/audio/
 * ==============================================================================
 */

export const romanticContent: RomanticContentConfig = {
  // Tela Inicial (Música de fundo: Era Óbvio)
  welcome: {
    message: "Para alguém muito especial... Preparei este site para dizer tudo o que sinto por você!",
    buttonText: "Entrar",
    audioSrc: "/audio/era-obvio.mp3",
  },

  // Menu Principal
  journey: {
    title: "Nossa Jornada",
    audioSrc: "/audio/era-obvio.mp3",
  },

  // Os 4 Níveis
  levels: [
    {
      id: 1,
      title: "Nível 1",
      audioSrc: "/audio/era-obvio.mp3",
      audioTitle: "Era Óbvio",
      content: {
        messageParagraphs: [
          "Meu bem, se me dissessem no começo que aquelas conversas totalmente aleatórias do dia a dia virariam a melhor parte do meu dia, eu não acreditaria. Com o tempo, você foi se tornando cada vez mais especial pra mim, a gente percebeu tantas coisas em comum. A facilidade com que a gente fala sobre as coisas que acontecem em nossas vidas e a confiança que temos um no outro são coisas que eu guardo com muito carinho."
        ],
        photos: [
          {
            id: "l1-p1",
            src: "/images/foto_2.jpeg",
            caption: "Nosso momento especial",
            alt: "Nós dois no Nível 1",
            aspectRatio: "3:4",
          },
        ],
      },
    },

    {
      id: 2,
      title: "Nível 2",
      audioSrc: "/audio/era-obvio.mp3",
      audioTitle: "Era Óbvio",
      content: {
        messageParagraphs: [
          "Mynique, quanto mais eu te conheço, mais fico impressionado. Você é dona de um talento absurdo e de uma voz incrível, às vezes me pergunto: \"Como alguém pode ser tão perfeita assim?\" parece impossível uma só pessoa ter tantos dons. Admiro a sua gentileza, a sua responsabilidade e acima de tudo, o amor e a dedicação que você tem com a sua mãe, sempre querendo fazer ela se orgulhar da filha incrível que tem. Você é simplesmente linda. Amo o seu cabelo, a sua energia e o jeito como você ilumina tudo ao redor. Você é minha pessoa de LUZ."
        ],
        photos: [
          {
            id: "l2-p1",
            src: "/images/foto_1.jpeg",
            caption: "Espaço reservado para foto",
            alt: "Foto Nível 2",
            aspectRatio: "4:3",
          },
        ],
      },
    },

    {
      id: 3,
      title: "Nível 3",
      audioSrc: "/audio/era-obvio.mp3",
      audioTitle: "Era Óbvio",
      content: {
        messageParagraphs: [
          "Hoje, você é a primeira pessoa com quem quero dividir uma notícia boa e quem eu procuro quando o dia é difícil. Você me faz querer ser melhor, só por ser quem você é. \n\nAntes de você ir para o próximo e último nível, olhe embaixo do seu travesseiro!"
        ],
        photos: [
          {
            id: "l3-p1",
            src: "/images/foto_3.jpeg",
            caption: "Espaço reservado para foto",
            alt: "Foto Nível 3",
            aspectRatio: "4:3",
          },
        ],
      },
    },

    {
      id: 4,
      title: "Nível 4",
      audioSrc: "/audio/era-obvio.mp3",
      audioTitle: "Era Óbvio",
      isGrandFinale: true,
      content: {
        messageParagraphs: [
          "A verdade é que eu me apaixonei pela minha melhor amiga. Não quero perder nada do que a gente construiu, mas não consigo mais guardar isso só pra mim eu quero viver algo ainda maior com você.\nJá saímos várias vezes como amigos, que tal vivermos o próximo nível? \n\nAceita sair comigo pro nosso primeiro Date?"
        ],
        photos: [],
        responseButtons: [
          "Vamos ser só amigos mesmo.",
          "Podemos tentar.",
          "Até que emfim"
        ],
      },
    },
  ],
};
